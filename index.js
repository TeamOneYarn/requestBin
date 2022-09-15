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

app.get("/", async (request, response) => {

  results = await Request.find({});
  let basket;
  let one;

  results = results.map(obj => ({header: JSON.parse(obj.headers), body: obj.body}))

  switch(results.length) {
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

  console.log(results[0].body)
  response.render('home', {basket, one, results})
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

