use std::time::Duration;

use mongodb::{
    Client, Database,
    bson::{Document, doc},
    options::{ClientOptions, Credential},
};

use crate::config::Config;

pub(crate) async fn connect(config: &Config) -> mongodb::error::Result<Database> {
    let mut options = ClientOptions::parse(&config.mongo_uri).await?;
    tracing::info!(
        database = %config.mongo_database,
        "Initializing MongoDB client"
    );

    // Set credentials separately rather than inserting passwords into a URI.
    options.credential = Some(
        Credential::builder()
            .username(config.mongo_username.clone())
            .password(config.mongo_password.clone())
            .source(config.mongo_database.clone())
            .build(),
    );

    options.app_name = Some("raccoon-pirate".to_owned());
    options.server_selection_timeout = Some(Duration::from_secs(5));
    options.connect_timeout = Some(Duration::from_secs(5));
    options.max_pool_size = Some(10);

    let client = Client::with_options(options)?;
    let database = client.database(&config.mongo_database);

    // Client creation alone does not prove connectivity or permissions.
    check_read_access(&database).await?;
    tracing::info!("Verifying MongoDB connectivity and read access");
    Ok(database)
}

pub(crate) async fn check_read_access(database: &Database) -> mongodb::error::Result<()> {
    database
        .collection::<Document>("terminal_commands")
        .find_one(doc! {})
        .projection(doc! { "_id": 1 })
        .max_time(Duration::from_secs(2))
        .await?;

    Ok(())
}

pub(crate) fn log_error(error: &mongodb::error::Error, operation: &'static str) {
    use mongodb::error::ErrorKind;
    let (category, hint, server_code) = match error.kind.as_ref() {
        ErrorKind::Authentication { .. } => (
            "authentication",
            "Check the application username, password and authentication database",
            None,
        ),
        ErrorKind::ServerSelection { .. } => (
            "server_selection",
            "Check database status, hostname, published ports and Docker networks",
            None,
        ),
        ErrorKind::DnsResolve { .. } => ("dns", "Check the MongoDB hostname and network DNS", None),
        ErrorKind::Io(_) => (
            "network_io",
            "Check connectivity and whether MongoDB is accepting connections",
            None,
        ),
        ErrorKind::InvalidArgument { .. } => (
            "configuration",
            "Check the MongoDB connection options",
            None,
        ),
        ErrorKind::Command(command) => (
            "database_command",
            "Check the server error code and application account permissions",
            Some(command.code),
        ),
        _ => (
            "other",
            "Inspect database service logs for additional context",
            None,
        ),
    };

    tracing::error!(
        operation,
        category,
        server_code = ?server_code,
        hint,
        "MongoDB operation failed"
    );
}
