use axum::{Json, extract::State, http::StatusCode};
use serde::Serialize;

use crate::{database, state::AppState};

#[derive(Serialize)]
pub(crate) struct ReadinessResponse {
    status: &'static str,
}

pub(crate) async fn check(State(state): State<AppState>) -> (StatusCode, Json<ReadinessResponse>) {
    match database::check_read_access(&state.database).await {
        Ok(()) => (StatusCode::OK, Json(ReadinessResponse { status: "ready" })),
        Err(error) => {
            database::log_error(&error, "readiness");
            (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(ReadinessResponse {
                    status: "unavailable",
                }),
            )
        }
    }
}
