require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGO,{useNewUrlParser:true}).then(()=>console.log('Coupen Data base connected'))

const Coupensceama=new mongoose.Schema({
   coupen:{
      type:String,
      required:true
   },
   discountvalue:{
    type:Number,
    required:true
   },
   createdate:{
    type:String,
    required:true
   },
   minPurchase:{
    type:String,
    require:true
   },
   expiredate:{
    type:String,
    required:true
   },
   discounttype:{
    type :String,
    required:true
   },
   status:{
    type:String,
    required:true
   },
   maxamount:{
    type:String,
    required:true
   }


})

const coupen =new mongoose.model("coupenCollection",Coupensceama)
module.exports={coupen}
