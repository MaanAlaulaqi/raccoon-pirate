//! HTTP boundary: receive JSON, call a service, return JSON.

use axum::Json;

use crate::{
    models::loot::{LootRequest, LootResponse},
    services::loot as loot_service,
};

// `Json<LootRequest>` is the parameter's type.
// `Json(payload)` destructures that wrapper to obtain the parsed request.
// Axum rejects malformed or incompatible JSON before calling this handler.
pub(crate) async fn secure_the_loot(Json(payload): Json<LootRequest>) -> Json<LootResponse> {
    let response = loot_service::secure(payload);

    // Wrapping the result in Json makes Axum serialize it and set Content-Type.
    Json(response)
}
