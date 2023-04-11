require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGO,{useNewUrlParser:true}).then(()=>console.log('Data base connected'))

const usersceama=new mongoose.Schema({
    name:{
        type:String,
    required:true},
    email:{
        type:String,
    required:true},
    password:{
        type:String,
    requireda:true},
    status:{
        type:Boolean,
        required:true
    },
    address:{
        type:Array,
        required:true   
    },
    coupon:{
        type:Array,
        required:true
    },
    wallet:{
      type:Number,
      required:true  
    }
})

const user=new mongoose.model("usersdatas",usersceama)
module.exports={user}

