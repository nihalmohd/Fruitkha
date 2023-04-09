require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGO,{useNewUrlParser:true}).then(()=>console.log('Cart Data base connected'))

const cartsceama=new mongoose.Schema({ 
products:{
    type:Array,
    require:true
},
user:{
    type:String,
    require:true
}

})

const userCart=new mongoose.model("userCart",cartsceama)
module.exports={userCart}