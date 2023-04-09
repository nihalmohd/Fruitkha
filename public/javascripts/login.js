function loginvalidation(){
    var email=document.login.email.value;
    var password=document.login.password.value;
    const passwordregx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm
    const emailregx = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm
    let loginfeilds=document.getElementsByClassName("text-danger")
 if(email==""&&password==""){
    let i = 0 
    while(i<loginfeilds.length){
        loginfeilds[i].innerHTML="This Feild Is Required"
        i++
    }
    return false
 }
 if(email==""){
    loginfeilds[0].innerHTML='Email Is Required'
    return false;
 }
 if(emailregx.test(email)==false){
 loginfeilds[0].innerHTML="Enterd Email Is Invalid Format"
 return false;
 }
if(password==""){
loginfeilds[1].innerHTML="Password Is Required"
return false;
}
if(passwordregx.test(password)==false){
   loginfeilds[1].innerHTML="Enterd Email Is Invalid Format"
   return false ;
}
return true;
}

function loginerrdisplay(){
    const loginfeilds=document.getElementsByClassName("text-danger")
    let i = 0
    while(i<loginfeilds.length){
        loginfeilds[i].innerHTML="" 
        i++
    }
}