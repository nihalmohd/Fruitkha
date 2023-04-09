function adminlogindata(){
   var email=document.adminlogin.email.value;
   var password=document.adminlogin.password.value;
   const passwordregx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm
   const emailregx = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm
   let adminloginfeilds=document.getElementsByClassName("text-danger text-center")

  if(email==""&&password==""){
   let i = 0
   while(i<adminloginfeilds.length){
     adminloginfeilds[i].innerHTML="This Feild Is Required"
     i++
   }
   return false
  }
  if(email==""){
   adminloginfeilds[0].innerHTML='Email Is Required'
   return false;
}
if(emailregx.test(email)==false){
adminloginfeilds[0].innerHTML="Enterd Email Is Invalid Format"
return false;
}
if(password==""){
adminloginfeilds[1].innerHTML="Password Is Required"
return false;
}
if(passwordregx.test(password)==false){
 adminloginfeilds[1].innerHTML="Enterd Email Is Invalid Format"
  return false ;
}
return true;
}

function adminloginerrdisplay(){
   const adminloginfeilds=document.getElementsByClassName("text-danger text-center")
   let i = 0
   while(i<adminloginfeilds.length){
       adminloginfeilds[i].innerHTML="" 
       i++
   }
}

