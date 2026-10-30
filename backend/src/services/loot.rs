//! Demonstration business logic: build a message, without storing anything.

use crate::models::loot::{LootRequest, LootResponse};

// This function is synchronous: it performs no asynchronous I/O.
// `payload` is passed by value; ownership transfers from the controller here.
// A stateless function is enough: no service class or DI container is required.
pub(crate) fn secure(payload: LootRequest) -> LootResponse {
    let message = format!(
        "Secured {} units of '{}' from the tarmac cargo bins!",
        payload.quantity, payload.item
    );

    LootResponse {
        message,
        success: true,
    }
}
