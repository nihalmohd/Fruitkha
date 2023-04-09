
function addproductFun() {
    var productname = document.addproduct.productname.value;
    var brand = document.addproduct.brand.value;
    var catogory = document.addproduct.catogory.value;
    var price = document.addproduct.price.value;
    var stoke = document.addproduct.stoke.value;
    var description = document.addproduct.description.value;
    let addproductsfeilds = document.getElementsByClassName('text-danger text-center')
    if (productname == "" && brand == "" && catogory == "" && price == "" && stoke == "" && description == "") {
        let i = 0
        while (i < addproductsfeilds.length) {
            addproductsfeilds[i].innerHTML = "This Feild Is Required"
            i++
        }
        return false
    }
    if (productname == "") {
        addproductsfeilds[0].innerHTML = "Product Name Is Required"
        return false;
    }
    if (productname.length < 5) {
        addproductsfeilds[0].innerHTML = "Enterd Name Invalid Formate"
        return false;
    }
    if (brand == "") {
        addproductsfeilds[1].innerHTML = "Brand Is Required"
        return false;
    }
    if (brand.length < 3) {
        addproductsfeilds[1].innerHTML = "Brand Atleast 3 charecter"
        return false;
    }
    if (catogory == "") {
        addproductsfeilds[2].innerHTML = "Please Select A Category"
        return false;
    }
    if (price == "") {
        addproductsfeilds[3].innerHTML = "Price is Required"
        return false;
    }
    if (price < 1) {
        addproductsfeilds[3].innerHTML = "Price Must Mtart after 1"
        return false;
    }
    if (stoke == "") {
        addproductsfeilds[4].innerHTML = "Stoke Field Is Required"
        return false;
    }
    if (stoke < 0) {
        addproductsfeilds[4].innerHTML = "Stoke Must Start after 0"
        return false;
    }
    if (description == "") {
        addproductsfeilds[5].innerHTML = "Describtion Field Is Required"
        return false;
    }
 
    return true
}

function adminaddproductrrrdisplay() {
    const addproductsfeilds = document.getElementsByClassName("text-danger text-center")
    let i = 0
    while (i < addproductsfeilds.length) {
        addproductsfeilds[i].innerHTML = ""
        i++
    }
}

