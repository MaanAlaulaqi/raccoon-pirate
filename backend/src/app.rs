use axum::{
    Router, middleware,
    routing::{get, post},
};

use crate::{
    auth,
    controllers::{admin, health, loot, readiness, welcome},
    logging,
    state::AppState,
};

pub(crate) fn create_app(state: AppState) -> Router {
    let admin_routes =
        Router::new()
            .route("/me", get(admin::me))
            .route_layer(middleware::from_fn_with_state(
                state.clone(),
                auth::require_owner,
            ));

    Router::new()
        .route("/api", get(welcome::welcome_to_the_tarmac))
        .route("/api/health", get(health::secure_health))
        .route("/api/ready", get(readiness::check))
        .route("/api/loot", post(loot::secure_the_loot))
        .nest("/api/admin", admin_routes)
        .layer(middleware::from_fn(logging::request))
        .with_state(state)
}
