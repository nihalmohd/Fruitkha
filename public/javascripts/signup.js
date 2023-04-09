function signupvalidation(){
    var name=document.signup.name.value;
    var email=document.signup.email.value;
    var password=document.signup.password.value;
    var re_password=document.signup.re_password.value;
    const passwordregx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm
    const emailregx = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm
    const nameregx = /^[a-zA-Z\s]{5,16}$/i
      let allfeild=document.getElementsByClassName("mb-2 text-danger")
       
      if(name==""&& email==""&& password==""&& re_password==""){
      let i = 0 
      while(i<allfeild.length){
        allfeild[i].innerHTML ="This Feild Is Required!"
        i++
      }
      return false
    }

    if(name==""){
     allfeild[0].innerHTML="Name Is Required"
      return false;
      }
      if(nameregx.test(name)==false){
       allfeild[0].innerHTML="Entered Name Is Invalid Format";
        return false
      }
      if(email==""){
       allfeild[1].innerHTML="Email Is Required";
        return false;
      }
      if(emailregx.test(email)==false){
        allfeild[1].innerHTML="Entered Email Is Invalid Format";
        return false;
      }
      if(password==""){
       allfeild[2].innerHTML="Password Is Required";
        return false;
      }
      if(passwordregx.test(password)==false){
        allfeild[2].innerHTML="Entered Password Is Invalid Format";
         return false
       }

      if(re_password==""){
        allfeild[3].innerHTML="re_password Is Required";
        return false;
      }
      if(passwordregx.test(re_password)==false){
        allfeild[4].innerHTML="Entered re-Password Is Invalid Format";
         return false
       }
      if(re_password!=password){
        allfeild[4].innerHTML="Password Is Not Match"
        return false
      }

      return true;
    }

    function errordisplay(){
      const allfeild=document.getElementsByClassName('mb-2 text-danger')
      let i = 0
      while(i<allfeild.length){
        allfeild[i].innerHTML=""
        i++
      }
    }