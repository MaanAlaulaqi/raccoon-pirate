#!/usr/bin/env bash
set -eu

: "${KRATOS_DB_PASSWORD:?KRATOS_DB_PASSWORD must be set}"

psql \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --set=ON_ERROR_STOP=1 \
  --set=runtime_password="$KRATOS_DB_PASSWORD" <<'SQL'
CREATE ROLE bridge_troll
  LOGIN
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  PASSWORD :'runtime_password';

ALTER DATABASE the_bridge OWNER TO bridge_troll;
SQL