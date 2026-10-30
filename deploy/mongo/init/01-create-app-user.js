// Runs automatically when MongoDB initializes an empty data directory.
// The backend gets its own account rather than using the root credentials.

const password = process.env.MONGO_APP_PASSWORD;

if (!password) {
  throw new Error("MONGO_APP_PASSWORD must be set");
}

const appDatabase = db.getSiblingDB("raccoon_pirate");

appDatabase.createUser({
  user: "chief_rat_clerk", // service account
  pwd: password,
  roles: [
    {
      role: "readWrite",
      db: "raccoon_pirate",
    },
  ],
});