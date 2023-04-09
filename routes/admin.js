var express = require('express');
var router = express.Router();
const admin=require('../contoler/admin controler')
const verifyadmin=require('../Middlewar/middlewar').verifyadmin
const nocache=require('nocache');
const { user } = require('../model/user');

router.use(nocache())

/* GET home page. */
router.get('/',admin.adminlogin);
router.get('/admin-home',verifyadmin,admin.adminhome)
router.get('/admin-product',verifyadmin,admin.adminproduct)
router.get('/admin-addproduct',verifyadmin,admin.adminaddproduct)
router.get('/admin-category',verifyadmin,admin.admicategory)
router.get('/admin-editcategory/:id',verifyadmin,admin.admineditcategory)
router.get('/admin-editproduct/:id',verifyadmin,admin.adminedit)
router.get('/listproduct/:id',admin.adminunlist)
router.get('/unlistproduct/:id',admin.adminlist)
router.get('/deletecategory/:id',admin.admindeletcategory)
router.get('/admin-usermanagement',verifyadmin,admin.adminusermanagement)
router.get('/admin-deleteusers/:id',admin.admindeletuser)
router.get('/admin-block/:id',admin.adminblock)
router.get('/admin-Unblock/:id',admin.adminUnblock)
router.get('/admin-logout',admin.adminlogout)
router.get('/admin/banner',admin.adminbanner)
router.get('/disableBanner/:id',admin.disbleBanner)
router.get('/visibleBanner/:id',admin.visibleBanner)
router.get('/order',admin.orderPage)
router.get('/OrderedProdcuts/:id',admin.orderdProducts)
router.get('/coupen',admin.admincoupen)
router.get('/disablecoupen/:id',admin.disablecoupen)
router.get('/coupenenable/:id',admin.Visiblecoupen)
router.get('/coupenremove/:id',admin.Visiblecoupen)
router.get('/getChart-Data',admin.chartData)
router.get('/admin/sales',admin.salesReport)


// router.get('/edit/:id',admin.)

// Post methode\
router.post('/cancelled/:id',admin.orderCancel)
router.post('/deliverd/:id',admin.orderdeliverd)
router.post('/shipping/:id',admin.ordershipping)
router.post('/coupeninsert',admin.coupeninsert)
router.post('/admin/addbanner',admin.addbanner)
router.post('/admin-addproduct',admin.addproducts)
router.post('/admin-editproduct/:id',admin.editproduct)
router.post('/admin-category',admin.category)
router.post('/admin-editcategory/:id',admin.editcategory)
router.post('/admin-login',admin.Adminlogin)

module.exports = router;
