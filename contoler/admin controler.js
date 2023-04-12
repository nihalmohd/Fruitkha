const { ObjectId } = require('mongodb')
const admindata=require('../model/admin').admindata
const addproduct=require('../model/adminaddproduct')
const addcategory=require('../model/admin catagory')
const usersdata=require('../model/user').user
const session = require('express-session');
const { loginemail } = require('./users controler')
const order = require('../model/order').order
const Coupencollections=require('../model/coopenSchema').coupen

const bannercollection =require("../model/banner").banner



// Admin GET mathode
let errmsg
let CategoryExisterr
// const { render } = require("../app");
// const { default: mongoose } = require('mongoose')
// const { coupen } = require('../model/coopenSchema')

const adminlogin= function(req, res) {
  admin=req.session.admin
  if(admin){
    res.redirect('/admin/admin-home')
  }else{
    res.render('admin-login',{errmsg});
    errmsg=null
  }  
  }
  const adminhome=async function(req,res){
    let userCount=await usersdata.countDocuments();
    let orederCount=await order.countDocuments();
    let productCount=await addproduct.countDocuments();
    let revenueData=await order.aggregate([
      {
        $match:{paymentStatus:"paid"}
      },
      {    

        $group:{_id:null,revenue:{$sum:"$TotalAmount"}}
      }
    ])
    res.render('admin-home',{userCount,orederCount,productCount,revenue:revenueData[0].revenue})
  }
  const adminproduct=async function(req,res){
    let product=await addproduct.find().lean()
    res.render('admin-product',{product})
  }
  const adminaddproduct=async function(req,res){
    let displaycategory=await addcategory.find().lean()
    res.render('admin-addproduct',{displaycategory})
  }
  const admicategory=async function(req,res){
     let viewcategory=await addcategory.find().lean()
    res.render('admin-category',{viewcategory,CategoryExisterr})
    CategoryExisterr=null
  }

  const adminunlist= async function (req,res){
    let unlistId=req.params.id
  await addproduct.updateOne({_id:new ObjectId(unlistId)},{$set:{status:false}})
  res.redirect("/admin/admin-product")
    }
    const adminlist= async function (req,res){
      let listId=req.params.id
    await addproduct.updateOne({_id:new ObjectId(listId)},{$set:{status:true}})
    res.redirect("/admin/admin-product")
    }
 const adminedit=async function(req,res){
  let id=req.params.id
  let editdata=await addproduct.findOne({_id:id}).lean()
  console.log("hii",editdata);
  let displaycategory=await addcategory.find().lean()
  console.log("hii",displaycategory);
  res.render('admin-editproduct',{editdata,displaycategory})
 } 
 const admindeletcategory=async function(req,res){
  let deletecategoryId=req.params.id
  await addcategory.deleteOne({_id:new ObjectId(deletecategoryId)})
  res.redirect('/admin/admin-category')
 }
const admineditcategory=async function(req,res){
  let editid=req.params.id
  let editcategorydata=await addcategory.findOne({_id:editid}).lean()
  res.render('admin-editcategory',{editcategorydata})
}
const adminusermanagement= async function(req,res){
let userdatas=await usersdata.find().lean()
// console.log(userdatas);
  res.render('admin-usermanagement',{userdatas})
}
const admindeletuser=async function(req,res){
  let userdeleteId=req.params.id
  // console.log(req.params.id);    
  await usersdata.deleteOne({_id:new ObjectId(userdeleteId)})
  res.redirect('/admin/admin-usermanagement')
}
const adminblock=async function(req,res){
  let blockId=req.params.id
  await usersdata.updateOne({_id:blockId},{$set:{
    status:false
  }})
  res.redirect('/admin/admin-usermanagement')
}

const adminUnblock=async function(req,res){
  let blockId=req.params.id
  await usersdata.updateOne({_id:blockId},{$set:{
    status:true
  }})
  res.redirect('/admin/admin-usermanagement')
}
const adminlogout=function(req,res){
    req.session.admin=null
  res.redirect('/admin')
}
const adminbanner= async function(req,res){
  let bannerdisplay=await bannercollection.find().lean()
  // console.log(bannerdisplay);
  res.render('adminBanner',{bannerdisplay})
}
const disbleBanner= async function(req,res){
  let disableId=req.params.id
  // console.log(disableId);
  await bannercollection.updateOne({_id:new ObjectId(disableId)},{$set:{status:false}})
  res.redirect('/admin/admin/banner')
}

const visibleBanner= async function(req,res){
  let visibleId=req.params.id
  // console.log(disableId);
  await bannercollection.updateOne({_id:new ObjectId(visibleId)},{$set:{status:true}})
  res.redirect('/admin/admin/banner')
}


const orderPage=async function(req,res){
 let orderdetails=await order.find().lean()
  res.render('adminOrder',{orderdetails})
}
const orderdProducts=async function(req,res){
  let orderid=req.params.id
  let orderstatus=await order.findOne({_id:new ObjectId(orderid)}).lean()
  let ordetprodata=await order.aggregate([{$match:{_id:new ObjectId(orderid)}},{$unwind:"$products"},{$project:{item:'$products.item',quantity:'$products.quantity'}},{$lookup:{from:'addproducts',localField:'item',foreignField:'_id',as:'Details'}},{$project:{item:1,quantity:1,Details:{$arrayElemAt:['$Details',0]}}}])
  console.log(ordetprodata);
  res.render('orderproduct',{ordetprodata,orderstatus,orderid})
}
const admincoupen=async function(req,res){
let coupendatas=await Coupencollections.find().lean()
console.log(coupendatas);  
  res.render('adminCoupen',{coupendatas})
}

const disablecoupen = async function(req,res){ 

  let disablecoupenId=req.params.id
  await Coupencollections.updateOne({_id:new ObjectId(disablecoupenId)},{$set:{status:false}})
  res.redirect('/admin/coupen')
}

const Visiblecoupen = async function(req,res){
  let visiblecoupenId=req.params.id
  await Coupencollections.updateOne({_id:new ObjectId(visiblecoupenId)},{$set:{status:true}})
  res.redirect('/admin/coupen')
}
const ordershipping= async function(req,res){
  console.log(req.body);
  shipping=req.body.value
  orderShipping=req.params.id
  await order.updateOne({_id:new ObjectId(orderShipping)},{$set:{status:shipping}})
  res.redirect('/admin/order')
}
const orderdeliverd= async function(req,res){
  console.log(req.body);
  deliverd=req.body.value
  orderDeliverdid=req.params.id
  await order.updateOne({_id:new ObjectId(orderDeliverdid)},{$set:{status:deliverd}})
  res.redirect('/admin/order')
}



const chartData=async function(req,res){
  console.log("apiiiiiiiiiii");
  let monthWise=await order.aggregate([
    {
        $match:{paymentStatus:'paid'}
    },
    {
        $group:{_id:'$month',revenue:{$sum:'$TotalAmount'}}
    },
    {
        $sort:{_id:1}
    }
 ])
 console.log("a=monthwise",monthWise);
 res.json(monthWise)
}

  
const salesReport=function(req,res){
  res.render("salesRepot")
}



/////////////////////////////////////////////// Admin post methode /////////////////////////////////////////////

const addproducts=function(req,res){
  const file = req.files.image
   console.log(req.body)
  file.mv('./public/product-images/'+file.name+'.jpg')
    let addproductdata={
      productname:req.body.productname,
      brand:req.body.brand,
      catogory:req.body.catogory,
      price:req.body.price,
      stoke:req.body.stoke,
      image:file.name+'.jpg',
      description:req.body.description,
      status:true
    }
    // console.log(addproductdata);
     addproduct.insertMany([addproductdata])
    res.redirect('/admin/admin-product')
}
const editproduct=async function(req,res){
  id=req.params.id
  let product=await addproduct.findOne({_id:id}).lean()
  let image=product.image[0]
  imageedit=req.files.image
  // console.log(req.files);
  // console.log(image);
  imageedit.mv('./public/product-images/'+image+'.jpg')
  let arr=[image+".jpg"]
  await addproduct.updateOne({_id:id},{$set :{
    productname:req.body.productname,
    brand:req.body.brand, 
    catogory:req.body.catogory,
    price:req.body.price,
    stoke:req.body.stoke,
    description:req.body.description,
    image:arr,
    status:true
  }})
  res.redirect('/admin/admin-product')
}
const category=async function(req,res){
  let details={
    category:req.body.category,
    status:true
  }
  if(details.category==""){
    res.redirect('/admin/admin-category')
    CategoryExisterr="This category is Required"
  }else{
    categoryExist=await addcategory.findOne({category:details.category}).lean()
    if(categoryExist==null){
       await addcategory.insertMany([details])
    res.redirect('/admin/admin-category')
    }else{
      res.redirect('/admin/admin-category')
      CategoryExisterr="This category is already Exist"
    }
  }
}
const editcategory=async function(req,res){
  let id=req.params.id
  await addcategory.updateOne({_id:id},{$set:{
    category:req.body.category
  }})

  res.redirect('/admin/admin-category')
}

const Adminlogin = async function(req,res){
  const admin= await admindata.findOne({email:req.body.email}).lean()
  if(admin){
    // console.log(req.body.email);
  if(req.body.password==admin.password){
    req.session.admin=admin
    res.redirect('/admin/admin-home')
  }
  else{
  errmsg="invalid password"
  res.redirect('/admin')
  }
  }else{
    errmsg="invalid email"
    res.redirect('/admin')
  }
}

const addbanner= async function(req,res){
  const Bannerimg = req.files.bannerimage
  // console.log(Bannerimg)
  Bannerimg.mv('./public/BannerImage/'+Bannerimg.name+".jpg")
  let bannerdetails={
    title:req.body.title,
    subtitle:req.body.subtitle,
    BannerImage:Bannerimg.name+".jpg",
    status:true
  }
  await bannercollection.insertMany([bannerdetails])
  res.redirect('/admin/admin/banner')
}

const coupeninsert= async function(req,res){
   console.log(req.body);
   let coupenDetails={
      coupen:req.body.coupencode,
      discountvalue:req.body.discountvalue,
      createdate:req.body.createdate,
      minPurchase:req.body.minpurchese,
      expiredate:req.body.expiredate,
      discounttype:req.body.discounttype,
      maxamount:req.body.maxamount,
      status:true
   }
    await Coupencollections.insertMany([coupenDetails])
   res.redirect('/admin/coupen')
}

const orderCancel=async function(req,res){
  console.log(req.body);
  cancelled=req.body.value
  ordercancelId=req.params.id
  await order.updateOne({_id:new ObjectId(ordercancelId)},{$set:{status:cancelled}})
  res.redirect('/admin/order')
}

const orderReturned=async function(req,res){
  returned=req.body.value
  orderReturnedid=req.params.id
  let findpro=await order.findOne({_id:new ObjectId(orderReturnedid)})
  RetunAmount=findpro.TotalAmount
  retuneduser=findpro.userId
  console.log(RetunAmount);
  await order.updateOne({_id:new ObjectId(orderReturnedid)},{$set:{status:returned}})
  await usersdata.updateOne({_id:new ObjectId(retuneduser)},{$inc:{wallet:RetunAmount}})
  res.redirect('/admin/order')
}


  module.exports={
    adminlogin,
    adminhome,
    adminproduct,
    adminaddproduct,
    addproducts,
    adminunlist,
    adminlist,
    adminedit,
    editproduct,
    admicategory,    
    category,
    admindeletcategory,
    admineditcategory,
    editcategory,
    adminusermanagement,
    admindeletuser,
    adminblock,
    adminUnblock,
    Adminlogin,
    adminlogout,
    adminbanner,
    addbanner,
    disbleBanner,
    visibleBanner,
    orderPage,
    orderdProducts,
    admincoupen,
    coupeninsert,
    disablecoupen,
    Visiblecoupen,
    ordershipping,
    orderdeliverd,
    orderCancel,
    orderReturned,
    chartData,
    salesReport

  }