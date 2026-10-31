use mongodb::Database;

use crate::services::auth::AuthService;

#[derive(Clone)]
pub(crate) struct AppState {
    pub(crate) database: Database,
    pub(crate) auth: AuthService,
}
