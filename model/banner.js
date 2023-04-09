require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGO,{useNewUrlParser:true}).then(()=>console.log('Banner Data base connected'))
const bannerSchema=new mongoose.Schema({
    BannerImage:{
        type:Array,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    subtitle:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    }


})


const banner=new mongoose.model("banner",bannerSchema)
module.exports={banner}