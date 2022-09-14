const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(err => console.log('error connecting to MongoDB:', err.message))

const requestSchema = new mongoose.Schema({
  body: String,
  headers: String
})

module.exports = mongoose.model('Request', requestSchema)