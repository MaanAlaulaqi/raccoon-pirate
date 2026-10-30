mod app;
mod controllers;
mod models;
mod services;

use std::net::SocketAddr;

// This macro starts Tokio's async runtime before running our async main body.
#[tokio::main]
async fn main() {
    let app = app::create_app();
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind to socket address");

    println!("🦝 🏴‍☠️ The tarmac is listening on {}", addr);

    axum::serve(listener, app)
        .await
        .expect("Server encountered a critical error");
}
