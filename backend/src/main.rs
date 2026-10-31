mod app;
mod config;
mod controllers;
mod database;
mod logging;
mod models;
mod services;
mod state;

use std::{net::SocketAddr, process};

use config::Config;
use state::AppState;

fn main() {
    // Resolve the file relative to backend/, regardless of the terminal's cwd.
    let env_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join(".env");

    match dotenvy::from_path(env_path) {
        Ok(()) => {}
        Err(dotenvy::Error::Io(error)) if error.kind() == std::io::ErrorKind::NotFound => {
            // Expected in Docker: Compose supplies the variables.
        }
        Err(_) => {
            // Avoid printing parser errors that might contain secret values.
            eprintln!("Could not load backend/.env. Check its format and permissions.");
            process::exit(1);
        }
    }

    logging::init();
    run();
}

#[tokio::main]
async fn run() {
    tracing::info!("Starting the tarmac");

    let config = Config::from_env().unwrap_or_else(|error| {
        tracing::error!(
            error = %error,
            "Configuration validation failed"
        );
        process::exit(1);
    });

    let database = database::connect(&config).await.unwrap_or_else(|error| {
        database::log_error(&error, "startup");
        process::exit(1);
    });

    let app = app::create_app(AppState { database });
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .unwrap_or_else(|error| {
            tracing::error!(
                error = %error,
                address = %addr,
                "Failed to bind HTTP listener"
            );
            process::exit(1);
        });

    tracing::info!(address = %addr, "HTTP server listening");

    if let Err(error) = axum::serve(listener, app).await {
        tracing::error!(
            error = %error,
            "HTTP server stopped unexpectedly"
        );
        process::exit(1);
    }
}
