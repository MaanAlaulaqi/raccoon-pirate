use std::{env, io};

pub(crate) struct Config {
    pub(crate) mongo_uri: String,
    pub(crate) mongo_database: String,
    pub(crate) mongo_username: String,
    pub(crate) mongo_password: String,
    pub(crate) kratos_internal_url: String,
}

impl Config {
    pub(crate) fn from_env() -> io::Result<Self> {
        Ok(Self {
            mongo_uri: required("MONGO_URI")?,
            mongo_database: required("MONGO_DATABASE")?,
            mongo_username: required("MONGO_USERNAME")?,
            mongo_password: required("MONGO_APP_PASSWORD")?,
            kratos_internal_url: required("KRATOS_INTERNAL_URL")?,
        })
    }
}

fn required(name: &str) -> io::Result<String> {
    env::var(name)
        .ok()
        .filter(|value| !value.is_empty())
        .ok_or_else(|| io::Error::other(format!("{name} must be set")))
}
