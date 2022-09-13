require('dotenv').config()
const express = require("express")
var bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

const PORT = 3014;
const url = process.env.MONGODB_URI

var jsonParser = bodyParser.json()

function parseRequest(request) {

}

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(err => console.log('error connecting to MongoDB:', err.message))

const requestSchema = new mongoose.Schema({
  body: String,
  headers: String
})

const Request = mongoose.model('Request', requestSchema)

app.get("/", (request, response) => {
  
  Request.find({}).then(result => {
  result.forEach((obj) => {
    console.log(obj)
    })
  mongoose.connection.close()
  })
  response.send("Hello world.")
})

app.post("/", jsonParser, async (request, response) => {
  const obj = await new Request({
  body: request.body,
  headers: request.headers
  })


  await obj.save()

  await mongoose.connection.close()

})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

