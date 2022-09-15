const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB...')

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(err => console.log('error connecting to MongoDB:', err.message))

const requestSchema = new mongoose.Schema({
  body: Object,
  headers: Object
})

module.exports = mongoose.model('Request', requestSchema)