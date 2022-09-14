const { Client } = require('pg')

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT, // this is Postgres Port; where do we put Proxy Port?
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

