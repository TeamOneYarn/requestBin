const { Client } = require('pg')

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
})

console.log("connecting to local postgres...")

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

/*
NEW TABLE SCHEMAS
CREATE DATABASE yarn_basket;

CREATE TABLE users(
  id serial PRIMARY KEY,
  random_string text UNIQUE NOT NULL
);

CREATE TABLE bins(
  id serial PRIMARY KEY,
  subdomain text UNIQUE NOT NULL,
  created_at timestamp DEFAULT NOW(),
  last_updated timestamp DEFAULT NOW(),
  request_count int DEFAULT 0,
  user_id int,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE requests(
  id serial PRIMARY KEY,
  method text,
  time_received timestamp,
  source_ip text,
  mongo_id text,
  bin_id int,
  FOREIGN KEY (bin_id) REFERENCES bins (id)
);
*/

module.exports = client