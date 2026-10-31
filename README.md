# raccoon pirate

a personal site. under construction. so am i.

## run locally

start the local databases and kratos first. you'll need your env files.

frontend:

```sh
npm ci
npm run dev
```

backend, in another terminal:

```sh
cargo run --manifest-path backend/Cargo.toml
```

open http://127.0.0.1:9001

## deploy

merge into `dev`. github actions takes it from there.

## license

mit. help yourself.
