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
CREATE DATABASE yarn_basket;

CREATE TABLE ip_address(
  id serial PRIMARY KEY,
  ip text NOT NULL
);

CREATE TABLE bins(
  id serial PRIMARY KEY,
  created_at timestamp DEFAULT NOW(),
  last_updated timestamp,
  request_count int,
  share_path text,
  ip_address_id int,
  FOREIGN KEY (ip_address_id) REFERENCES ip_address (id)
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