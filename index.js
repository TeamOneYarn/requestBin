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

function createState(bins) {
  let state = { bins: [] }

  bins.forEach(bin => {
    let newBin = { request_count: bin.request_count, created_at: bin.created_at, requests: [] }

    let selectRelatedRequests = `SELECT mongo_id FROM requests WHERE bin_id = ($1)`
    let binId = [bin.id]
    pool.query(selectRelatedRequests, binId).then(res => {
      res.rows.forEach(request => {
        let newRequest = {}
        let mongoId = request.mongo_id.replaceAll('"', '');
        console.log(mongoId, "mongoId here")

        Request.find({_id: mongoId}).then(res => {
          console.log(res, "result from mongoose request")
          newRequest.headers = res.headers
          newRequest.body = res.body

          newBin.requests.push(newRequest)
        }) 
      })
    })

    state.bins.push(newBin)
  })

  return state
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

app.get("/:path", (request, response) => {
  let path = request.params.path;

  let findId = `SELECT id FROM users WHERE random_string = ($1);`
  let values1 = [path]
  pool.query(findId, values1).then(res => {
    if (res.rows.length == 0) {
      response.send("user doesn't exist");
      return
    }

    let userId = res.rows[0].id

    let findAllBins = `SELECT * FROM bins WHERE user_id = ($1);`
    let values = [userId]
    pool.query(findAllBins, values).then(async (res) => {
      let bins = res.rows // returns array of objects
      console.log(bins)

      let state = createState(bins);
      console.log(state, "state here")
      let basket;
      let one;

      let results = state.bins.map(bin => {
        console.log(bin, "bin here")
        return bin.requests
      })

      switch(state.bins.length) {
        case 0:
          basket = false;
          break;
        case 1:
          basket = true;
          one = true;
          break
        default:
          basket = true
          one = false;
      }

      // console.log(results[0].body)
      console.log(basket, "basket here")
      console.log(one, "one here")
      console.log(results, "result here")
      response.render('home', {basket, one, results}) // multiple baskets view
    }).catch(err => console.error('Error collecting all user bins', err.stack));
  }).catch(err => console.error('Error executing query', err.stack))
})

app.post("/create/:path", async (request, response) => {
  let path = request.params.path
  let subdomain = makeId(20)

  let findId = `SELECT id FROM users WHERE random_string = ($1);`
  let values1 = [path]
  pool.query(findId, values1).then(res => {
    let userId = res.rows[0].id

    let query = `INSERT INTO bins (subdomain, user_id) VALUES ($1, $2) RETURNING *`
    let values = [subdomain, userId]
    pool.query(query, values).then(res => {
      console.log(res.rows[0])
    }).catch(err => console.error('Error insert query', err.stack));
  })
  .catch(err => console.error('Error executing query', err.stack))
  response.redirect(`/${path}`)
})

app.post("/:path/:subdomain", (request, response) => {
  let subdomain = request.params.subdomain
  let path = request.params.path

  let findPath = `SELECT id FROM users WHERE random_string = ($1);`
  let values2 = [path]
  pool.query(findPath, values2).then(res => {
    if (res.rows.length == 0) {
      response.send("user doesn't exist");
      return
    }
    
    let findId = `SELECT id FROM bins WHERE subdomain = ($1);`
    let values1 = [subdomain]

    pool.query(findId, values1).then(res => {
      if (res.rows.length == 0) {
        response.send("bin doesn't exist");
        return
      }

      const obj = new Request({
        body: JSON.stringify(request.body),
        headers: JSON.stringify(request.headers)
      })

      obj.save().then(savedRequest => {
        let mongoId = savedRequest._id

        let createRequest = `INSERT INTO requests (bin_id, mongo_id) VALUES ($1, $2) RETURNING *`
        let binId = res.rows[0].id
        let values = [binId, mongoId]
        pool.query(createRequest, values).then(res => {
          let getCurrentCount = `SELECT request_count FROM bins WHERE id = ($1)`;
          let values4 = [binId]
          pool.query(getCurrentCount, values4).then(res => {
            let count = Number(res.rows[0].request_count) + 1

            let updateCount = `UPDATE bins SET request_count = ($1) WHERE id = ($2)`
            let values5 = [count, binId]
            pool.query(updateCount, values5).then(res => {
              console.log("Request Saved")
              console.log("Count updated")
            }).catch(err => console.error('Error saving request and count', err.stack));
          }).catch(err => console.error('Error updating count', err.stack));
        }).catch(err => console.error('Error getting currentCount', err.stack));
      }).catch(err => console.error('Error saving request', err.stack));
    }).catch(err => console.error('Error selecting bin', err.stack));
  }).catch(err => console.error('Error selecting user', err.stack));
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

