require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const Handlebars = require('express-handlebars');

const jsonParser = bodyParser.json()
const app = express()

app.use(express.static('public'))

const hbs = Handlebars.create({ /* config */ });
const Request = require('./models/request')

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');



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

  response.render('home', {basket: true, one: false})
})

app.post("/", jsonParser, (request, response) => {
  const obj = new Request({
    body: JSON.stringify(request.body),
    headers: JSON.stringify(request.headers)
  })

  obj.save().then(savedRequest => response.json(savedRequest))
  // mongoose.connection.close()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

