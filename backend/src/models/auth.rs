use serde::Serialize;

#[derive(Clone, Serialize)]
pub(crate) struct AuthenticatedUser {
    pub(crate) identity_id: String,
    pub(crate) role: &'static str,
}
