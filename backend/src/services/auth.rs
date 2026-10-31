use std::{io, time::Duration};

use mongodb::{
    Database,
    bson::{Document, doc},
};
use reqwest::{Client, Url, redirect::Policy};
use serde::Deserialize;

use crate::{database, models::auth::AuthenticatedUser};

#[derive(Clone)]
pub(crate) struct AuthService {
    client: Client,
    whoami_url: Url,
}

pub(crate) enum AuthError {
    Unauthorized,
    Forbidden,
    Unavailable,
}

#[derive(Deserialize)]
struct KratosSession {
    active: bool,
    identity: KratosIdentity,
}

#[derive(Deserialize)]
struct KratosIdentity {
    id: String,
    state: String,
}

impl AuthService {
    pub(crate) fn new(base_url: &str) -> io::Result<Self> {
        let base =
            Url::parse(base_url).map_err(|_| io::Error::other("Invalid KRATOS_INTERNAL_URL"))?;

        if !matches!(base.scheme(), "http" | "https")
            || base.host_str().is_none()
            || !base.username().is_empty()
            || base.password().is_some()
            || base.query().is_some()
            || base.fragment().is_some()
            || base.path() != "/"
        {
            return Err(io::Error::other(
                "KRATOS_INTERNAL_URL must be an HTTP origin without credentials or a path",
            ));
        }

        let whoami_url = base
            .join("sessions/whoami")
            .map_err(|_| io::Error::other("Invalid Kratos session endpoint"))?;

        let client = Client::builder()
            .timeout(Duration::from_secs(5))
            .redirect(Policy::none())
            .no_proxy()
            .build()
            .map_err(|_| io::Error::other("Failed to create Kratos HTTP client"))?;

        Ok(Self { client, whoami_url })
    }

    pub(crate) async fn authorize_owner(
        &self,
        database: &Database,
        session_cookie: &str,
    ) -> Result<AuthenticatedUser, AuthError> {
        let response = self
            .client
            .get(self.whoami_url.clone())
            .header("Cookie", session_cookie)
            .header("Accept", "application/json")
            .send()
            .await
            .map_err(|error| {
                tracing::error!(
                    timeout = error.is_timeout(),
                    connection_error = error.is_connect(),
                    "Kratos session verification request failed"
                );

                AuthError::Unavailable
            })?;

        match response.status().as_u16() {
            200 => {}
            401 | 403 => return Err(AuthError::Unauthorized),
            status => {
                tracing::error!(
                    upstream_status = status,
                    "Kratos returned an unexpected session response"
                );

                return Err(AuthError::Unavailable);
            }
        }

        let session: KratosSession = response.json().await.map_err(|_| {
            tracing::error!("Kratos returned an invalid session response");
            AuthError::Unavailable
        })?;

        if !session.active || session.identity.state != "active" {
            return Err(AuthError::Unauthorized);
        }

        let grant = database
            .collection::<Document>("access_grants")
            .find_one(doc! {
                "_id": session.identity.id.as_str(),
                "role": "owner",
                "enabled": true,
            })
            .projection(doc! { "_id": 1 })
            .await
            .map_err(|error| {
                database::log_error(&error, "owner_authorization");
                AuthError::Unavailable
            })?;

        if grant.is_none() {
            tracing::warn!("Admin access denied: enabled owner grant missing");
            return Err(AuthError::Forbidden);
        }

        tracing::debug!("Owner authorization verified");

        Ok(AuthenticatedUser {
            identity_id: session.identity.id,
            role: "owner",
        })
    }
}
