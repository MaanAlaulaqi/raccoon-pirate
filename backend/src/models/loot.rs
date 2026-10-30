use serde::{Deserialize, Serialize};

// `derive` generates the implementation that reads JSON into this struct.
#[derive(Deserialize)]
pub(crate) struct LootRequest {
    // Fields need visibility too, so sibling modules can access them.
    pub(crate) item: String,
    // An unsigned 32-bit integer: 0 through 4,294,967,295.
    pub(crate) quantity: u32,
}

// This implementation writes the response struct as JSON.
#[derive(Serialize)]
pub(crate) struct LootResponse {
    pub(crate) message: String,
    pub(crate) success: bool,
}
