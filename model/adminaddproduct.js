require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO, { useNewUrlParser: true }).then(() => console.log('Add product base connected'))

const adminaddprductSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    catogory: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stoke: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }


})
const addproduct = new mongoose.model("addproduct", adminaddprductSchema)
module.exports = addproduct;

