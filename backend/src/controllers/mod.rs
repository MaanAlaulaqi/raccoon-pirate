//! Declare the controller modules. No request handling belongs in this file.
//!
//! Unlike a TypeScript barrel exporting functions, these declarations make the
//! sibling files modules; callers use paths such as controllers::loot::... .

pub(crate) mod admin;
pub(crate) mod health;
pub(crate) mod loot;
pub(crate) mod readiness;
pub(crate) mod welcome;
