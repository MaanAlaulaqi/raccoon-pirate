use std::{
    io::IsTerminal,
    sync::atomic::{AtomicU64, Ordering},
    time::Instant,
};

use axum::{
    extract::{MatchedPath, Request},
    middleware::Next,
    response::Response,
};
use tracing::Instrument;
use tracing_subscriber::EnvFilter;

// Identifies requests within this running process.
static NEXT_REQUEST_ID: AtomicU64 = AtomicU64::new(1);

pub(crate) fn init() {
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("warn,raccoon_pirate=info"));

    let subscriber = tracing_subscriber::fmt()
        .with_env_filter(filter)
        .with_target(false);

    if std::env::var("LOG_FORMAT").as_deref() == Ok("json") {
        subscriber
            .json()
            .with_current_span(true)
            .with_span_list(false)
            .init();
    } else {
        subscriber
            .compact()
            .with_ansi(std::io::stdout().is_terminal())
            .init();
    }
}

pub(crate) async fn request(request: Request, next: Next) -> Response {
    let request_id = NEXT_REQUEST_ID.fetch_add(1, Ordering::Relaxed);

    // Use the registered route pattern, not the full URL or query string.
    let route = request
        .extensions()
        .get::<MatchedPath>()
        .map(|path| path.as_str())
        .unwrap_or("unmatched")
        .to_owned();

    let is_healthcheck = route == "/api/health" || route == "/api/ready";

    let span = tracing::info_span!(
        "http.request",
        request_id,
        method = %request.method(),
        route = %route,
    );

    async move {
        let started = Instant::now();

        tracing::debug!("Request started");

        let response = next.run(request).await;
        let status = response.status();
        let latency_ms = started.elapsed().as_secs_f64() * 1000.0;

        if status.is_server_error() {
            tracing::error!(status = status.as_u16(), latency_ms, "Request completed");
        } else if status.is_client_error() {
            tracing::warn!(status = status.as_u16(), latency_ms, "Request completed");
        } else if is_healthcheck {
            tracing::debug!(
                status = status.as_u16(),
                latency_ms,
                "Healthcheck completed"
            );
        } else {
            tracing::info!(status = status.as_u16(), latency_ms, "Request completed");
        }

        response
    }
    .instrument(span)
    .await
}
