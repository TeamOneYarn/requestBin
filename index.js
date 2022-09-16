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
    console.log('connected to postgres')
  }
})

app.use(express.static('public'))

const hbs = Handlebars.create({ /* config */ });
const Request = require('./models/request')

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

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

app.get('/', async (request, response) => {
  let id = makeId(10) // further improvement if time
  let query = `INSERT INTO users (random_string) VALUES ($1) RETURNING *`
  let values = [id]
  pool.query(query, values)
  .then(res => {
    console.log(res.rows[0].random_string)
    response.redirect(`/${id}`)
  })
  .catch(err => console.error('Error executing query', err.stack))

})

app.post("/", (request, response) => {
  let subdomain = request.subdomains[0]

  let findId = `SELECT id FROM bins WHERE subdomain = ($1);`
  let values1 = [subdomain]
  pool.query(findId, values1).then(res => {
    if (res.rows.length == 0) {
      response.send("user doesn't exist");
      return
    }

    const obj = new Request({
      body: JSON.stringify(request.body),
      headers: JSON.stringify(request.headers)
    })

    obj.save().then(savedRequest => {
      let mongoId = savedRequest._id

      let createRequest = `INSERT INTO requests (bin_id, mongo_id) VALUES ($1, $2) RETURNING *`
      let values = [res.rows[0].id, mongoId]
      pool.query(createRequest, values).then(res => {
        console.log("Request Saved")
      })
    }).catch(err => console.error('Error saving request', err.stack));
  }).catch(err => console.error('Error selecting bin', err.stack));

})


app.get("/:path", (request, response) => {
  let path = request.params.path;

  let findId = `SELECT id FROM users WHERE random_string = ($1);`
  let values1 = [path]
  pool.query(findId, values1).then(res => {
    if (res.rows.length == 0) {
      response.send("user doesn't exist");
      return
    }

    userId = res.rows[0].id

    let findAllBins = `SELECT * FROM bins WHERE user_id = ($1);`
    let values = [userId]
    pool.query(findAllBins, values).then(res => {
      let bins = res.rows // returns array of objects
      console.log(bins)

      response.send("hellooo")
      //do page rending here
      // results = await Request.find({});
      // let basket;
      // let one;

      // results = results.map(obj => ({header: JSON.parse(obj.headers), body: obj.body}))

      // switch(results.length) {
      //   case 0:
      //     basket = false;
      //     break;
      //   case 1:
      //     basket = true;
      //     one = true;
      //     break
      //   default:
      //     basket = true
      //     one = false;
      // }

      // console.log(results[0].body)
      // response.render('home', {basket, one, results}) // multiple baskets view
      // response.render('home', {basket: false, one: undefined, results: undefined}) // no-baskets view
     // response.render('home', {basket: true, one: true, results: undefined}) // one-basket view w/ no requests yet
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
  response.redirect(`/${path}`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

