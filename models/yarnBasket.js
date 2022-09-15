const { Client } = require('pg')

const client = new Client({connectionString: process.env.POSTGRES_URI})

console.log("connecting to postgres on fly...")

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

// flyctl postgres connect -a request-bin
// --> takes me to postgres console

// database name: yarn_basket (\c yarn_basket)

// problem might be regarding DNS
/*
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


// client.connect()
//   .then(res => )
// const res = client.query('SELECT $1::text as message', ['Hello world!']).then((res) => console.log(res)).then(() => client.end())
// console.log(res.rows[0].message) // Hello world!
// await client.end()

// const client = new Client({
//   host: process.env.PGHOST,
//   port: process.env.PGPORT, // this is Postgres Port; where do we put Proxy Port?
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,

// })

module.exports = client