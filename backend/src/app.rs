use axum::{
    Router,
    routing::{get, post},
};

use crate::controllers::{health, loot, welcome};

pub(crate) fn create_app() -> Router {
    // No semicolon on the final expression: its value is returned.
    Router::new()
        .route("/api", get(welcome::welcome_to_the_tarmac))
        .route("/api/health", get(health::secure_health))
        .route("/api/loot", post(loot::secure_the_loot))
}
