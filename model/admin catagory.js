require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO, { useNewUrlParser: true }).then(() => console.log('Category Data base connected'))

const addcategoryshema = new mongoose.Schema({
       category: {
              type: String,
              required: true
       },
       status: {
              type: Boolean,
              required: true
       }
})

const category = new mongoose.model('category', addcategoryshema)
module.exports = category
