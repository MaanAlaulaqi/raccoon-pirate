use axum::{Extension, Json};

use crate::models::auth::AuthenticatedUser;

pub(crate) async fn me(Extension(user): Extension<AuthenticatedUser>) -> Json<AuthenticatedUser> {
    Json(user)
}
