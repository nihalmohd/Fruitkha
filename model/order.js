require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGO,{useNewUrlParser:true}).then(()=>console.log('order Data base connected'))

const ordersceama=new mongoose.Schema({
deliverydetails:{
    type:Object,
    required : true
},
userId:{
    type:String,
    required:true
},
payment:{
    type:String,
    required:true
},
products:{
    type:Array,
    required:true
},
TotalAmount:{
    type:Number,
    required:true
},
status:{
    type:String,
    required:true
},
orderdate:{
    type:String,
    required:true,
},
paymentStatus:{
   type:String,
   required:true,
},
month:{
    type:Number,
    required:true
}

})



const order=new mongoose.model("order",ordersceama)
module.exports={order}