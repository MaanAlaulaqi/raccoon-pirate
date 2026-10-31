use axum::{
    Json,
    extract::{Request, State},
    http::{
        HeaderMap, HeaderValue, StatusCode,
        header::{CACHE_CONTROL, COOKIE},
    },
    middleware::Next,
    response::{IntoResponse, Response},
};
use serde::Serialize;

use crate::{services::auth::AuthError, state::AppState};

#[derive(Serialize)]
struct ErrorResponse {
    error: &'static str,
}

pub(crate) async fn require_owner(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Response {
    let Some(cookie) = session_cookie(request.headers()) else {
        return rejection(StatusCode::UNAUTHORIZED, "authentication_required");
    };

    match state.auth.authorize_owner(&state.database, &cookie).await {
        Ok(user) => {
            request.extensions_mut().insert(user);

            let mut response = next.run(request).await;
            response
                .headers_mut()
                .insert(CACHE_CONTROL, HeaderValue::from_static("no-store"));

            response
        }
        Err(AuthError::Unauthorized) => {
            rejection(StatusCode::UNAUTHORIZED, "authentication_required")
        }
        Err(AuthError::Forbidden) => rejection(StatusCode::FORBIDDEN, "owner_access_required"),
        Err(AuthError::Unavailable) => rejection(
            StatusCode::SERVICE_UNAVAILABLE,
            "authentication_service_unavailable",
        ),
    }
}

fn session_cookie(headers: &HeaderMap) -> Option<String> {
    let mut result = None;

    // Forward only Kratos's session cookie, not unrelated browser cookies.
    for header in headers.get_all(COOKIE).iter() {
        let header = header.to_str().ok()?;

        for part in header.split(';') {
            let Some((name, value)) = part.trim().split_once('=') else {
                continue;
            };

            if name == "ory_kratos_session" {
                // Reject ambiguous duplicate session cookies.
                if result.is_some() || value.is_empty() {
                    return None;
                }

                result = Some(format!("ory_kratos_session={value}"));
            }
        }
    }

    result
}

fn rejection(status: StatusCode, error: &'static str) -> Response {
    (
        status,
        [(CACHE_CONTROL, "no-store")],
        Json(ErrorResponse { error }),
    )
        .into_response()
}
