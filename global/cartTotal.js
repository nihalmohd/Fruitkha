

const userCart=require("../model/cart").userCart

async function cartTotal(userId){
    console.log(userId);
    return new Promise(async(resolve,reject)=>{
        let totalCartPrice=await userCart.aggregate([
            {$match:{user:userId}},{$unwind:'$products'},
            {$project:{item:"$products.item",quantity: "$products.quantity"}},
            {
              $lookup:{
                from:'addproducts',
                localField:"item",
                foreignField:'_id',
                as:'productdetails'
              }
            },
            { $project:{item: 1, quantity: 1,products:{ $arrayElemAt:['$productdetails',0]}}},
            {$group:{_id:null,total:{$sum:{$multiply:['$quantity','$products.price']}}}}
          ])
          resolve(totalCartPrice)
    })
}


module.exports={cartTotal}