FROM rust:1-bookworm AS build

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --locked --release

FROM debian:bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --uid 10001 --create-home app

COPY --from=build /app/target/release/raccoon-pirate /usr/local/bin/tarmac

USER app
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
    CMD curl --fail --silent http://127.0.0.1:3000/api/ready || exit 1

CMD ["/usr/local/bin/tarmac"]