require('dotenv').config()
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const session = require('express-session');
const usersdata = require('../model/user').user
const addproduct = require('../model/adminaddproduct')
const userCart = require("../model/cart").userCart
const order = require('../model/order').order
const nodemailer = require("nodemailer");
const addcategory=require('../model/admin catagory')
const Total = require("../global/cartTotal")
const bannercollection = require("../model/banner").banner
const wishList=require("../model/wishList").userWhishList
const Coupencollections=require('../model/coopenSchema').coupen
const Razorpay = require('razorpay');


const uuid = require('uuid')

const { text } = require('express');
const nocache = require('nocache');
const { LEGAL_TLS_SOCKET_OPTIONS } = require('mongodb');
const { options, response } = require('../app');
const { category } = require('./admin controler');
const { log } = require('console');
// const { user } = require('../model/user');
// const { user } = require('../model/user');

var instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret })

let ban
let errmsg
var OTP
let userlogindetails
let totalprice
let cartAllDisplay
// let orderObj
let matingerr
let Emailexisterr
let passdata
let changePassworderr
let otperr
let erremail
var forgotOTP
var forgototperr
var setPasserr
var couponerr
var couponadd
var decresprice

// user get methods
const usershome = async function (req, res, next) {
  const user = req.session.user
  let displaybanner = await bannercollection.find({ status: true }).lean()

  // console.log("displayinggggggggg"+displaybanner);
  if (user) {
    const userId = user._id

    let cartCount = await userCart.findOne({ user: userId }).lean()
    if (cartCount) {
      const count = cartCount.products.length
      // console.log(count);
      req.session.count = count
    }

     passdata = await addproduct.find().lean()
    const count = req.session.count
    // console.log(count);
    res.render('users-home', { passdata, User: true, user, count, displaybanner })
    req.session.count = null
    req.session.logged = null
  } else {
    let passdata = await addproduct.find().lean()
    
    res.render('users-home', { passdata, displaybanner })
  }
}


const userslogin = function (req, res) {

    const data = userlogindetails
    const logerr = errmsg
    res.render('user login', { logerr, data })
    userlogindetails = null
    errmsg = null
  }


const userssignup = function (req, res) {
  user = req.session.user
  if (user) {
    res.redirect('/')
  } else {
    res.render('users-signup',{matingerr,Emailexisterr})
    matingerr=null
    Emailexisterr=null
  }

}
const usersingleproduct = async function (req, res) {

  const singleproductId = req.params.id
  var singleproduct

  await addproduct.findOne({ _id: new ObjectId(singleproductId) }).lean().then((data) => {
     singleproduct = data
  })
  // console.log(singleproduct.image)
  // console.log("varshaaa",singleproduct.stoke);
  res.render('user-singleproducts', { singleproduct,passdata })
}



const otplogin = function (req, res) {
  user = req.session.user
  if (user) {
    res.redirect('/')
  } else {
    res.render('otp login', { ban })
    ban==null
    // ban=null
  }

}
const otplogin2 = function (req, res) {
  user = req.session.user
  if (user) {
    res.redirect('/')
  } else {
    res.render('user-otplogin2',{otperr})
    otperr==null

  }
}

const logout = function (req, res) {
  req.session.user = null
  req.session.loggedin = null
  res.redirect('/users-login')
}



const cart = async function (req, res) {
  
  
  User = req.session.user


  // console.log(userId);
  if (User) {
    const userId = User._id
    Total.cartTotal(userId).then((data) => {
      totalprice = data
    })
     cartAllDisplay = await userCart.aggregate([
      { $match: { user: userId } }, { $unwind: '$products' },
      { $project: { item: "$products.item", quantity: "$products.quantity" } },
      {
        $lookup: {
          from: 'addproducts',
          localField: "item",
          foreignField: '_id',
          as: 'productdetails'
        }
      },
      { $project: { item: 1, quantity: 1, products: { $arrayElemAt: ['$productdetails', 0] } } }
    ])
    couponid=req.session.couponid
    if(couponid){
      let findcoupon=await Coupencollections.find({coupen:couponid})
      
      minimum=findcoupon[0].minPurchase
      console.log("hiiiiiiiiii",totalprice);
      if(totalprice[0].total <findcoupon[0].minPurchase){
        couponerr = "Please Buy Upto"+minimum
      }else{
        decresprice=findcoupon[0].discountvalue
        totalprice[0].total-=decresprice   
        console.log(totalprice[0].total);
        
         couponadd="Coupon Added Successful"
       await usersdata.updateOne({_id:userId},{$addToSet:{coupon:couponid}})
      } 
    }
    
    res.render('usersCart', { cartAllDisplay,User, totalprice,couponerr,couponadd})
    couponerr=null
    couponadd=null
    req.session.couponid=null
  } else {
    res.redirect('/users-login')
  }


}
const addtocart = async function (req, res) {
  // console.log(req.params.id)
  productId = req.params.id
  if (req.session.user) {
    userId = req.session.user._id
    // console.log(userId)
    productObj = {
      item: new ObjectId(productId),
      quantity: 1
    }
    let usercartdetails = await userCart.findOne({ user: userId }).lean()
    if (usercartdetails) {
      let productexist = usercartdetails.products.findIndex(products => products.item == productId)
      // console.log(productexist);
      if (productexist != -1) {
        res.redirect('/cart')
      } else {
        await userCart.updateOne({ user: userId }, { $push: { products: productObj } }).then()
        res.redirect('/cart')
      }
    } else {
      let cartObj = {
        user: userId,
        products: [productObj]
      }
      userCart.insertMany([cartObj]).then()
      res.redirect('/cart')
    }
  } else {
    res.redirect('/users-login')
  }

}

const deletecart = async function (req, res) {  
  cartdeleteid = req.params.id
  carttitemid = req.params.item
  // console.log(cartdeleteid);
  // console.log(carttitemid);
  await userCart.updateOne({ _id: new ObjectId(cartdeleteid) }, { $pull: { products: { item: new ObjectId(carttitemid) } } })
  res.redirect('/cart')
}

const checkout = async function (req, res) {
  couponid=req.session.couponid
  user = req.session.user
  if (user) {
    displayAddress = req.session.selected
    userId = req.session.user._id
     let walletexist=await usersdata.findOne({_id:userId})
     let walletPass=walletexist.wallet 
    let totalprice = await userCart.aggregate([
      { $match: { user: userId } }, { $unwind: '$products' },
      { $project: { item: "$products.item", quantity: "$products.quantity" } },
      {
        $lookup: {
          from: 'addproducts',
          localField: "item",
          foreignField: '_id',
          as: 'productdetails'
        }
      },
      { $project: { item: 1, quantity: 1, products: { $arrayElemAt: ['$productdetails', 0] } } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$products.price'] } } } }
    ])

    // console.log(totalprice[0].total); 
    if(couponid){
       totalpass = totalprice[0].total-=decresprice
    } else{
       totalpass = totalprice[0].total
    }
    userid=req.session.user._id
    let cart= await userCart.findOne({_id:userid})
    if(cart==null){
      res.redirect("/user/shop")
    }
    if(totalpass>walletPass){
      walletPass=0
    }
    
  
    res.render('checkout', { totalpass, user, displayAddress,walletPass})
  } else {
    res.redirect('/users-login')
  }
}

const showaddress = async function (req, res) {
  User = req.session.user
  if (User) {
    userId = req.session.user._id
    let User = await usersdata.findOne({ _id: new ObjectId(userId) }).lean()
    if(User.address?.length==0){
      res.redirect('/user/profile')
    }else{
      selectAddress = User.address
      // console.log(selectAddress);
      res.render('show-address', { selectAddress,User })
    }
  } else {
    res.redirect('/users-login')
  }

}
const addressPass = async function (req, res) {
  const user = req.session.user
  if (user) {
    const index = req.params.id
    const userId = user._id
    const selected = await usersdata.aggregate([{ $match: { _id: new ObjectId(userId) } }, { $unwind: '$address' }, { $match: { 'address.index': index } }])
    req.session.selected = selected[0].address
    res.redirect('/checkout')
  } else {
    res.redirect('/users-login')
  }

}
const userProfile = async function (req, res) {
  User = req.session.user
  if (User) {
    UserId = req.session.user._id
    let userProfile = await usersdata.findOne({ _id: new ObjectId(UserId)}).lean()
    res.render('userProfile', {userProfile,User})
  } else {
    res.redirect('/users-login')
  }

}

const shop = async (req, res) => {
  User = req.session.user;
   lowtohighsort= req.session.lowtohigh
   hightolow=req.session.HighToLow
  if (User) {

     if(req.session.showAll){
     req.session.category= null
     
     }
     const categories = req.session.category;
    let category = await addcategory.find().lean()
    if (categories) {
      productlist = await addproduct.find({ catogory: categories }).lean()
      console.log(productlist);
     
    } else {
      productlist = await addproduct.find().lean()
       if(lowtohighsort){
        productlist=lowtohighsort
        req.session.lowtohigh=null
       }
        if(hightolow){
          productlist=hightolow
          req.session.HighToLow=null
        }
    }
    res.render('userShop', { category,productlist,lowtohighsort ,hightolow,User});
    req.session.showAll = null
  } else {
    res.redirect('/users-login');
  }

}

const orderSuccess=function(req,res){
  user=req.session.user
  if(user){

    res.render('orderSuccess')  
  }else{
    res.redirect('/users-login')
  }
}
const shopAllProducts=function(req,res){
 req.session.showAll = true
  res.redirect("/user/shop")
}

const WhishList=async function(req,res){
  user=req.session.user
  if(user){
    const userId=user._id
    wishListAllDisplay = await wishList.aggregate([
      { $match: { user: userId } }, { $unwind: '$products'},
      { $project: { item: "$products.item", quantity: "$products.quantity" }},
      {
        $lookup: {
          from: 'addproducts',
          localField: "item",
          foreignField: '_id',
          as: 'productdetails'
        }
      },
      { $project: { item: 1, quantity: 1, products: { $arrayElemAt: ['$productdetails', 0] } } }
    ])
    console.log("apiiiiiiii",wishListAllDisplay);
    res.render("wishList",{wishListAllDisplay})
  }else{
    res.redirect("/users-login")
  }
  
}

const addWhishList=async function(req,res){
  user=req.session.user
  
  if(user){
    ProductId=req.params.id
    userId = req.session.user._id
    wishListObj = {
      item: new ObjectId(ProductId),
      quantity: 1
    }
    let whishListdetails = await wishList.findOne({ user: userId }).lean()
    if (whishListdetails) {
      let productexist = whishListdetails.products.findIndex(products => products.item == ProductId)
      if (productexist != -1) {
        res.redirect('/WhishList')
      } else {
        await wishList.updateOne({ user: userId }, { $push: { products: wishListObj } }).then()
        res.redirect('/WhishList')
      }
    } else {
      let wishListdisplayObj = {
        user: userId,
        products: [wishListObj]
      }
      wishList.insertMany([wishListdisplayObj]).then()
      res.redirect('/whishList')
    }
  }else{
    res.redirect("/users-login")
  }
}

const removeWishList=async function(req,res){
   whisListid=req.params.id
   whishListitemid = req.params.item
   await wishList.updateOne({ _id: new ObjectId(whisListid) }, { $pull: { products: { item: new ObjectId(whishListitemid) } } })
  res.redirect('/user/shop')
}
const orders=async function(req,res){
  User=req.session.user
  if(User){
    userid=User._id
    
    let userOrderdetails= await order.find({userId:userid}).lean()
    console.log(userOrderdetails);
    res.render("ShowOrders",{userOrderdetails,User})
  }else{
    res.redirect('/users-login')
  }
  
}

const ordersDetails=async function(req,res){
  user=req.session.user
  if(user){
  let orderid=req.params.id
  let orderprodata=await order.aggregate([{$match:{_id:new ObjectId(orderid)}},{$unwind:"$products"},{$project:{item:'$products.item',quantity:'$products.quantity'}},{$lookup:{from:'addproducts',localField:'item',foreignField:'_id',as:'Details'}},{$project:{item:1,quantity:1,Details:{$arrayElemAt:['$Details',0]}}}])
  console.log(orderprodata); 
  res.render('orderproductsdetails',{orderprodata,user})
}else{
res.redirect("/users-login")
}
}
const changePassword=function(req,res){
  res.render("changePassword",{changePassworderr})
  changePassworderr=null
}
const forgotPassword=function(req,res){
  res.render("forgotPassEmail",{erremail})
  erremail=null
}


const rememberOtp=function(req,res){
  res.render('OtpPass',{forgototperr})
  forgototperr=null
}

const SettingPassword=function(req,res){
  res.render("SetForgotPass",{setPasserr})
  setPasserr=null
}

const lowToHigh=async function(req,res){
  let lowtohigh=await addproduct.find().sort({price:1})
  req.session.lowtohigh=lowtohigh
  res.redirect('/user/shop')
  console.log(req.session.lowtohigh);
}

const HighToLow=async function(req,res){
  let HighToLow=await addproduct.find().sort({price:-1})
  req.session.HighToLow=HighToLow
  console.log(req.session.HighToLow);
  res.redirect('/user/shop')
}



////////////////////////////////////////////////// user post Methods//////////////////////////////////////////////////////////////////////////////////////////////
const usersposthome = async function (req, res) {
  // console.log(req.body);
  password=req.body.password
  Email=req.body.email
  let userdata = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    status: true,
    wallet:0
  }
  let emailExist=await usersdata.findOne({email:Email}).lean()
  if(emailExist===null){

    if(password===req.body.re_password){
    await usersdata.insertMany([userdata])
    // req.session.user = userdata
    res.redirect("/users-login")
    }else{
      matingerr="Confirom Password Is Not Matching"
      res.redirect("/users-signup")
    }
  }else{
    res.redirect('/users-signup')
    Emailexisterr="Email Is Already Used"
  }

}



const userlogin = async function (req, res) {
  // console.log(req.body);

  email = req.body.email,
    password = req.body.password

  let userlogindata = await usersdata.findOne({ email: email }).lean()
  // console.log(userlogindata);
  if (userlogindata) {
    if (userlogindata.status) {
      if (password === userlogindata.password) {
        req.session.user = userlogindata
        res.redirect('/')
      } else {
        errmsg = "Password Is Not Matching"
        userlogindetails = req.body
        res.redirect('/users-login')
      }
    } else {
      errmsg = "This Account Is Banned"
      userlogindetails = req.body
      res.redirect('/users-login')
    }
  } else {
    errmsg = "Email Not Registered"
    userlogindetails = req.body
    res.redirect('/users-login')
  }

}
const loginemail = async function (req, res) {
  let otpemail = req.body.email
  let useremail = await usersdata.findOne({ email: otpemail }).lean()
  req.session.otpemail = otpemail
  // console.log(useremail);
if(otpemail){
  if (useremail){
    if (useremail.status){
      let otp = Math.floor(100000 + Math.random() * 900000)
      OTP = otp
      const emailOtp = useremail.email
      let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:process.env.EMAIL ,
          pass: process.env.PASSWORD
        }
      })      
      let otpemaildetails = {
        from: process.env.EMAIL,
        to: emailOtp,
        subject: "fruitkha verification",
        text: otp + " fruitkha,Don`t share this code"
      }
      mailTransporter.sendMail(otpemaildetails, (err) => {
        if (err) {
          console.log(err)
        }

      })
      res.redirect('/users-otplogin')

    } else {
      ban = "This Account Is Banned"
      res.redirect('/user-otp')
    }
  } else {
    ban = "This Account not registered"
    res.redirect('/user-otp')
  }
}else{
  ban="Email is required"
  res.redirect('/user-otp')
}
}
const otp = async function (req, res) {
 const Otp=req.body.otp
  if(Otp){
  if (Otp == OTP) {
    const otpemail = req.session.otpemail
    const user = await usersdata.findOne({ email: otpemail }).lean()
    req.session.user = user
    res.redirect('/')
  }

  else {
    otperr="Please Enter valid OTP "
    res.redirect('/users-otplogin')
  }
}else{
  otperr="OTP is required"
  res.redirect('/users-otplogin')
}

}
const changeproductquantity = async function (req, res, next) {
  const response = {}
  let data = req.body
  user = req.session.user
  if (user) {
    const userId = user._id
    const cartId = req.body.cart
    const productId = req.body.product
    data.count = parseInt(data.count)
    data.quantity = parseInt(data.quantity)
    if (data.count == -1 && data.quantity == 1) {
      await userCart.updateOne({ _id: new ObjectId(cartId) },
        {
          $pull: { products: { item: new ObjectId(productId) } }
        }).then(() => {

          response.status = true
          res.json(response)
        })


    } else {

      await userCart.updateOne({ _id: new ObjectId(cartId), "products.item": new ObjectId(productId) },
        {
          $inc: { 'products.$.quantity': data.count }
        })
      response.total = await Total.cartTotal(userId);
      // console.log(response.total)
      response.status = false
      res.json(response)
    }

  } else {
    res.redirect('/users-login')
  }
}


const placeorder = async function (req, res) {
  console.log(req.body);
  userid = req.body.userId
 let Couponid=req.session.couponid
  let cart = await userCart.findOne({ user: userid }).lean()
  console.log(cart);
  let totalprice = await Total.cartTotal(userid)
  const index = uuid.v4()
  let status = req.body.payment === "COD" ? "Placed" : "Placed"
  let paymentstatus=req.body.payment==="COD" ? "not paid":"paid"
   orderObj = {
    deliverydetails: {
      index: index,
      fullname: req.body.fullname,
      lastname: req.body.lastname,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      pincode: req.body.pincode,
      state: req.body.state,
      city: req.body.city,
      town: req.body.town,
    },
    userId:new ObjectId(userid),
    payment: req.body.payment,
    paymentStatus:paymentstatus,
    products:cartAllDisplay,
    TotalAmount: totalprice[0].total,
    deliveryDate:new Date().toLocaleString(),
    orderdate: new Date().toLocaleString(),
    month:new Date().getMonth()+1,
    // DelivertDare:orderdate+new Date(),
    status: status,
  }
let products=orderObj.products
productCount=products.length;
  // console.log(productCount);
  for(i=0;i<productCount;i++){
    Qty=-(products[i].quantity)
    let productId=products[i].item
    addproduct.updateOne({_id:new ObjectId(productId)},{$inc:{stoke:Qty}}).then((d)=>{
      console.log(d);
    })  
  }
  req.session.orderObject=orderObj
  console.log("req session is printing",req.session.orderObject);
  usersdata.updateOne({ _id: new ObjectId(userid) }, { $push: { address: orderObj.deliverydetails } })

  if (req.body.payment === "COD") {
    await order.create(orderObj).then(async (response) => {
      let Orderdetails = await order.findOne().lean()
      let orderId = Orderdetails.id
      
      await userCart.deleteOne({ user: new ObjectId(userid) })
      res.json({ codSuccess: true })
    })
  } else if(req.body.payment==="online payment"){
     if(Couponid){
       totalAmount = totalprice[0].total-=decresprice 
     }else{
       totalAmount = totalprice[0].total
     }
     
    orderId = uuid.v4()
    var options = {      
      amount: totalAmount * 100,
      currency: "INR",
      receipt: "" + orderId
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.log(err);
      } else {
        // console.log("New order:", order);
        res.json(order)
      }
    })

  }else{
    await order.create(orderObj).then(async (response) => {
      // let Orderdetails = await order.findOne().lean()
      // let orderId = Orderdetails.id
      let wallettotal=totalprice[0].total
      await usersdata.updateOne({_id: new ObjectId(userid)},{$inc:{wallet:-wallettotal}}).then((d)=>{
        console.log(d);
      })
      
      
      await userCart.deleteOne({ user: new ObjectId(userid) })
      res.json({ codSuccess: true })
    })
  }

}


const verifyPayment = async function (req, res) {
  console.log(req.body);
  details=req.body
  // orderId=details['order[receipt]']
  const { createHmac } = await import('crypto');
  let hmac = createHmac('sha256', 'U9uRVnVYnZf0KAPTDojcgQN4');
  hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
  hmac=hmac.digest('hex')
  if(hmac==details['payment[razorpay_signature]']){
    console.log("order object:",orderObj);
   let orderOnline=orderObj
    // item=new ObjectId(orderOnline.products.item)
    // _id=new ObjectId(orderOnline.products._id)
     
    console.log("orderOnline:",orderOnline);
    orderOnline.products[0].products.paymentId=uuid.v4() 

    for(i=0;i<orderOnline.products[0].products.length;i++){
      orderOnline.products[0].products[i].paymentId=req.body['payment[razorpay_payment_id]']
    }


await order.insertMany([orderOnline])
await userCart.deleteOne({user:new ObjectId(userid)})  
    console.log("Payment successfull");
    res.json({status:true})
  }else{ 
    res.json({status:false,errMsg:''})
  }

  
}

const selectCategory=function(req,res){
  var response={}
  req.session.category=req.body.category
  res.json(response)

}

const getFruits= async function(req,res){
  let Payload=req.body.Payload;
  console.log(Payload);
  let search= await addproduct.find({productname:{$regex:new RegExp('^'+Payload+'.*','i')}}).exec(); 
  search=search.slice(0,10);
  res.send({Payload:search});  
}

const cancel=async function(req,res){
  let ordercancelId=req.params.id
  Cancelled=req.body.value
  await order.updateOne({_id:new ObjectId(ordercancelId)},{$set:{status:Cancelled}})
  res.redirect('/orders')
}

const ReturnProcessing=async function(req,res){
  let returnProcessingid=req.params.id
  returnProcessing=req.body.value
  await order.updateOne({_id:new ObjectId(returnProcessingid)},{$set:{status:returnProcessing}})
  res.redirect('/orders')
}


const multiaddress=async function(req,res){
  console.log(req.body);
  user=req.session.user
  
  const index = uuid.v4()
  if(user){
    userid=req.session.user._id
    let deliverydetails= {
      index: index,
      fullname: req.body.fullname,
      lastname: req.body.lastname,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      pincode: req.body.pincode,
      state: req.body.state,
      city: req.body.city,
      town: req.body.town,
    }
   await usersdata.updateOne({ _id: new ObjectId(userid) }, { $push: { address: deliverydetails } })
  
    res.redirect('/showAddress') 
  }else{
    res.redirect('/users-login')
  }
 
}
const createNewPassword=async function(req,res){
  console.log(req.body);
    currentPassword = req.body.currentpassword
  newPassword=req.body.newpassword
  confirmPassword=req.body.confirmpassword
   let checkpassword =await usersdata.findOne({password:currentPassword}).lean()
   userid=checkpassword._id
   console.log(checkpassword);
   if(checkpassword){
     if(newPassword===confirmPassword){
      await usersdata.updateOne({_id:new Object(userid)},{$set:{password:confirmPassword}})
       res.redirect('/user/profile')
     }else{
      changePassworderr="Confirm Password is not matching"
      res.redirect('/ChangePassword')
     }
   }else{
    changePassworderr="Current Password Is Not Matching"
    res.redirect('/ChangePassword')

   }
  }

  const forgotPassEmail=async function(req,res){
   forgotEmail=req.body.email
   let forgoteamil = await usersdata.findOne({ email: forgotEmail }).lean()
   req.session.forgotEmail = forgotEmail
   if(forgotEmail){
    if(forgoteamil){
      if(forgoteamil.status){
          let otp = Math.floor(100000 + Math.random() * 900000)
          forgotOTP = otp
          const emailOtp = forgoteamil.email
          let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user:process.env.EMAIL ,
          pass: process.env.PASSWORD
            }
          })      
          let otpemaildetails = {
            from:process.env.EMAIL,
            to: emailOtp,
            subject: "fruitkha verification",
            text: otp + " fruitkha,Forgot Password Otp Don`t share this code"
          }
          mailTransporter.sendMail(otpemaildetails, (err) => {
            if (err) {
              console.log(err)
            }
          })
          res.redirect('/remember/otp')
      }else{
        erremail="This Email is Banner"
      res.redirect("/forgotPassword")
      }
      
    }else{
      erremail="This Email Is Not Registerd"
      res.redirect("/forgotPassword")
    }
    
   }else{
    erremail="Email Is Required"
    res.redirect("/forgotPassword")
   }
  }


  const postotp=async function(req,res){
    console.log(req.body);
    const forgotPassOtp=req.body.otp
    if(forgotPassOtp){
    if (forgotPassOtp == forgotOTP) {
      const forgotemail = req.session.forgotEmail
      const user = await usersdata.findOne({ email: forgotemail}).lean()
      req.session.user = user
      res.redirect('/setPassword')
    }
  
    else {
      forgototperr="Please Enter valid OTP "
      res.redirect('/remember/otp')
    }
  }else{
    forgototperr="OTP is required"
    res.redirect('/remember/otp')
  }
  }



  const setForPass=async function(req,res){
    forgotemail=req.session.forgotEmail
    let getid=await usersdata.findOne({email:forgotemail}).lean()
    console.log(getid);
    userid=getid._id
    console.log(req.body);
    NewPassword=req.body.NewPassword
    confirmPassword=req.body.ConfirmPassword
    let passalredyexist=await usersdata.findOne({password:NewPassword}).lean()
    console.log(passalredyexist);
    if(passalredyexist==null){
      if(NewPassword===confirmPassword){
        await usersdata.updateOne({_id:new Object(userid)},{$set:{password:confirmPassword}})
        res.redirect('/users-login')
      }else{
        setPasserr="confirm Password Is Not Matching"
        res.redirect('/setPassword')
      }
    } else{
      setPasserr="This Password Is Already EXist"
      res.redirect('/setPassword')
    }
  }

const addcoupen=async function(req,res){
  couponid=req.body.couponcode
  console.log(req.body);
  if(couponid){
    let coupenChecking=await Coupencollections.findOne({coupen:couponid})
    console.log(coupenChecking);
  if(coupenChecking){
    const expire=new Date(coupenChecking.expiredate)
    console.log(expire);
    const date=new Date()
    console.log(date);
    const exp=(expire-date)/1000*60*60*24
    if(coupenChecking.status){
    if(exp > 0 ){
        req.session.couponid=couponid
        res.redirect("/cart")
    }else{
      couponerr="invalid coupon"
      res.redirect('/cart')
    }
  }else{
    res.redirect("/cart")
    couponerr="No coupon avalible now"
  }
  }else{
    couponerr="Invalid Coupon"
    res.redirect('/cart')           
  }
  }else{
    couponerr="Coupon code is required"
    res.redirect("/cart")
  }  
}


  

module.exports = {
  usershome,
  userslogin,
  userssignup,
  usersposthome,
  usersingleproduct,
  otplogin,
  userlogin,
  otplogin2,
  loginemail,
  otp,
  logout,
  addtocart,
  cart,
  changeproductquantity,
  deletecart,
  checkout,
  placeorder,
  showaddress,
  addressPass,
  userProfile,
  shop,
  verifyPayment,
  orderSuccess,
  selectCategory,
  shopAllProducts,
  getFruits,
  WhishList,
  addWhishList,
  removeWishList,
  orders,
  ordersDetails,
  cancel,
  ReturnProcessing,
  multiaddress,
  changePassword,
  createNewPassword,
  forgotPassword ,
  forgotPassEmail,
  rememberOtp,
  postotp,
  SettingPassword,
  setForPass,
  lowToHigh,
  HighToLow,
  addcoupen
}