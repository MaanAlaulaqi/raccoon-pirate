use mongodb::Database;

#[derive(Clone)]
pub(crate) struct AppState {
    pub(crate) database: Database,
}
