// migrate.js
const { Client } = require("pg");
const { DB_URI } = require("./config");

const client = new Client({
  connectionString: DB_URI,
});

client.connect();

client.query(`
  CREATE TABLE IF NOT EXISTS companies (
    handle TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    num_employees INTEGER,
    logo_url TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary INTEGER,
    equity NUMERIC CHECK (equity <= 1.0),
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS applications (
    username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs ON DELETE CASCADE,
    PRIMARY KEY (username, job_id)
  );
`)
  .then(() => {
    console.log("Tables created successfully");
    client.end();
  })
  .catch(err => {
    console.error("Error creating tables", err);
    client.end();
  });
