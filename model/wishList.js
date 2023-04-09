require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGO,{useNewUrlParser:true}).then(()=>console.log('wishList Data base connected'))

const wishListsceama=new mongoose.Schema({ 
products:{
    type:Array,
    require:true
},
user:{
    type:String,
    require:true
}

})

const userWhishList=new mongoose.model("userWhishList",wishListsceama)
module.exports={userWhishList}