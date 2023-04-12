var express = require('express');
const session = require('express-session');
var router = express.Router();
const user=require('../contoler/users controler')                       
const nocache = require('nocache')
router.use(nocache())
/* GET requsts */
router.get('/',user.usershome)
router.get('/users-login',user.userslogin)
router.get('/users-signup',user.userssignup)
router.get('/singleproduct/:id',user.usersingleproduct)
router.get('/user-otp',user.otplogin)
router.get('/users-otplogin',user.otplogin2)
router.get('/users-logout',user.logout)
router.get('/cart',user.cart)
router.get('/addToCart/:id',user.addtocart)
router.get('/cart/delete/:id/:item',user.deletecart)
router.get('/showAddress',user.showaddress)
router.get('/select/address/:id',user.addressPass)
router.get('/user/profile',user.userProfile)
router.get('/user/shop',user.shop)
router.get('/checkout',user.checkout)
router.get('/orderSuccess',user.orderSuccess)
router.get('/shopAllProducts',user.shopAllProducts)
router.get('/WhishList',user.WhishList)
router.get('/addWhishList/:id',user.addWhishList)
router.get('/removeWhishlist/:id/:item',user.removeWishList)
router.get('/orders',user.orders)
router.get('/ordersDetails/:id',user.ordersDetails)
router.get('/ChangePassword',user.changePassword)
router.get('/forgotPassword',user.forgotPassword)
router.get('/remember/otp',user.rememberOtp)
router.get('/setPassword',user.SettingPassword)
router.get('/lowToHigh',user.lowToHigh)
router.get('/HighToLow',user.HighToLow)


 

 

// POST methods
router.post('/addcoupon',user.addcoupen)
router.post('/createNewPassword',user.createNewPassword)
router.post('/multiaddress',user.multiaddress)
router.post('/cancel/:id',user.cancel)
router.post('/Return/:id',user.ReturnProcessing)
router.post('/user/getFruits',user.getFruits)
router.post('/selectCategory',user.selectCategory)
router.post('/verify-payment',user.verifyPayment)
router.post('/place-order',user.placeorder)
router.post('/change-product-quantity',user.changeproductquantity)
router.post('/users-signup',user.usersposthome)
router.post('/user-logindata',user.userlogin)
router.post('/email',user.loginemail)
router.post('/otp',user.otp)
router.post('/forgotPassEmail',user.forgotPassEmail)
router.post('/Post/otp',user.postotp)
router.post('/setForPass',user.setForPass)


module.exports = router;
