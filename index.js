require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const Handlebars = require('express-handlebars');
const jsonParser = bodyParser.json()
const app = express()

const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
})

pool.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

app.use(express.static('public'))

const hbs = Handlebars.create({ /* config */ });
const Request = require('./models/request')

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.post("/", jsonParser, (request, response) => {
  const obj = new Request({
    body: JSON.stringify(request.body),
    headers: JSON.stringify(request.headers)
  })

  obj.save().then(savedRequest => response.json(savedRequest))
  // mongoose.connection.close()
})

function makeId(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

app.get('/', async (req, res) => {
  let id = makeId(10) // further improvement if time
  let query = `INSERT INTO users (random_string) VALUES ($1) RETURNING *`
  let values = [id]
  pool.query(query, values)
  .then(res => console.log(res.rows[0].random_string))
  .catch(err => console.error('Error executing query', err.stack))

  res.redirect(`/${id}`)
})

app.get("/:path", (request, response) => {
  let path = request.params.path;

  let findId = `SELECT id FROM users WHERE random_string = ($1);`
  let values1 = [path]
  pool.query(findId, values1).then(res => {
    userId = res.rows[0].id

    let findAllBins = `SELECT * FROM bins WHERE user_id = ($1);`
    let values = [userId]
    pool.query(findAllBins, values).then(res => {
      let bins = res.rows // returns array of objects
      console.log(bins)

      response.send("hello")
      //do page rending here
    }).catch(err => console.error('Error collecting all user bins', err.stack));
  }).catch(err => console.error('Error executing query', err.stack))
})

app.post("/create/:path", async (request, response) => {
  let path = request.params.path
  let subdomain = makeId(20)

  let findId = `SELECT id FROM users WHERE random_string = ($1);`
  let values1 = [path]
  pool.query(findId, values1).then(res => {
    userId = res.rows[0].id

    let query = `INSERT INTO bins (subdomain, user_id) VALUES ($1, $2) RETURNING *`
    let values = [subdomain, userId]
    pool.query(query, values).then(res => {
      console.log(res.rows[0])
    }).catch(err => console.error('Error insert query', err.stack));
  })
  .catch(err => console.error('Error executing query', err.stack))
  // res.redirect(`/${path}`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

