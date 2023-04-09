require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGO,{useNewUrlParser:true}).then(()=>console.log('Admin Data base connected'))

const adminsceama=new mongoose.Schema({
     email:{
        type:String,
        required:true
     },
     password:{
         type:String,
         required:true
     }
})
const admindata=new mongoose.model("admindata",adminsceama)
module.exports={admindata}

