
function editproductFun() {
    var productname = document.editproduct.productname.value;
    var brand = document.editproduct.brand.value;
    var catogory = document.editproduct.catogory.value;
    var price = document.editproduct.price.value;
    var stoke = document.editproduct.stoke.value;
    var description = document.editproduct.description.value;
    let editproductsfeilds = document.getElementsByClassName('text-danger text-center')
    if (productname == "" && brand == "" && catogory == "" && price == "" && stoke == "" && description == "") {
        let i = 0
        while (i < editproductsfeilds.length) {
            editproductsfeilds[i].innerHTML = "This Feild Is Required"
            i++
        }
        return false
    }
    if (productname == "") {
        editproductsfeilds[0].innerHTML = "Product Name Is Required"
        return false;
    }
    if (productname.length < 5) {
        editproductsfeilds[0].innerHTML = "Enterd Name Invalid Formate"
        return false;
    }
    if (brand == "") {
        editproductsfeilds[1].innerHTML = "Brand Is Required"
        return false;
    }
    if (brand.length < 3) {
        editproductsfeilds[1].innerHTML = "Brand Atleast 3 charecter"
        return false;
    }
    if (catogory == "") {
        editproductsfeilds[2].innerHTML = "Please Select A Category"
        return false;
    }
    if (price == "") {
        editproductsfeilds[3].innerHTML = "Price is Required"
        return false;
    }
    if (price < 1) {
        editproductsfeilds[3].innerHTML = "Price Must Mtart after 1"
        return false;
    }
    if (stoke == "") {
        editproductsfeilds[4].innerHTML = "Stoke Field Is Required"
        return false;
    }
    if (stoke < 0) {
        editproductsfeilds[4].innerHTML = "Stoke Must Start after 0"
        return false;
    }
    if (description == "") {
        editproductsfeilds[5].innerHTML = "Describtion Field Is Required"
        return false;
    }
 
    return true
}

function admineditproductrrrdisplay() {
    const addproductsfeilds = document.getElementsByClassName("text-danger text-center")
    let i = 0
    while (i < addproductsfeilds.length) {
        addproductsfeilds[i].innerHTML = ""
        i++
    }
}

