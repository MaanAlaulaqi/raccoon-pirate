use axum::{
    Router, middleware,
    routing::{get, post},
};

use crate::{
    controllers::{health, loot, readiness, welcome},
    logging,
    state::AppState,
};

pub(crate) fn create_app(state: AppState) -> Router {
    Router::new()
        .route("/api", get(welcome::welcome_to_the_tarmac))
        .route("/api/health", get(health::secure_health))
        .route("/api/ready", get(readiness::check))
        .route("/api/loot", post(loot::secure_the_loot))
        .layer(middleware::from_fn(logging::request))
        .with_state(state)
}
