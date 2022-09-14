require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const app = express()
const Request = require('./models/request')

function parseRequest(request) {

}

app.get("/", (request, response) => {
  Request.find({})
    .then(result => {
      result.forEach((obj) => {
        console.log(obj)
    })
    // mongoose.connection.close()
  })

  response.send("Hello world.")
})

app.post("/", jsonParser, (request, response) => {
  const obj = new Request({
    body: request.body,
    headers: request.headers
  })

  obj.save().then(savedRequest => response.json(savedRequest))
  // mongoose.connection.close()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

