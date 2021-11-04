
onLoadCartNumbers();

let addCart = document.querySelectorAll(".add-btn")

let quantity = document.querySelectorAll("#quantity")

let trash = document.querySelectorAll("#trash-btn")

let product_name = document.querySelectorAll("#product_name")

let product_code = document.querySelectorAll("#product_code")



for (let i=0; i < addCart.length; i++) {

    addCart[i].addEventListener('click', () => {
        let cartItems = JSON.parse(localStorage.getItem('products'));
        let number = quantity[i].value;
        console.log(number)
        if (parseInt(number) > 0 ){ 
            addCart[i].textContent = "Added";
            addCart[i].disabled = true;
            trash[i].disabled = false;
            quantity[i].style.visibility = "hidden";
            onAddProduct();
		     cartNumbers()}
    function onAddProduct() {
        let prod = product_name[i].textContent
        let numb = number
        let ident = product_code[i].textContent
        let prodObject = {id:ident, productName:prod, amount:numb}
        if (cartItems != null) {
            cartItems = {...cartItems, [prodObject.id]:prodObject}}
                else { cartItems = {[prodObject.id]:prodObject}}
        localStorage.setItem('products',JSON.stringify(cartItems))
        } 
    })
}

for (let i=0; i < trash.length; i++) {

    trash[i].addEventListener('click', () => {
        let ident = product_code[i].textContent
        if (quantity[i].style.visibility === "hidden") {
            addCart[i].textContent = "Add to Cart";
            addCart[i].disabled = false;
            trash[i].disabled = true;
            quantity[i].value = null;
            quantity[i].style.visibility = "visible";
            reduceCartNumbers()
            }
        let cartItems = JSON.parse(localStorage.getItem('products'))
        let cart = Object.values(cartItems)	
    
    function removeItem(ident){
        cart = cart.filter(item => item.id !==ident );
        return cart	
    }

    let newArr = removeItem(ident);
    
    if (newArr.length !== 0 ){
    const convertArray = (array, key) => {
        const initialValue = {}
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item[key]]:item,
            };
        }, initialValue)}

    cartItems = convertArray(removeItem(ident), 'id' )
    localStorage.setItem('products', JSON.stringify(cartItems))
    } else {
    localStorage.removeItem('products')
    }

})
}


for (let i=0; i < addCart.length; i++) {
    
    const selectedProduct = product_code[i].textContent
    if (localStorage.getItem('products') != null) {
    const productCheckResult = productCheck(selectedProduct)
   
   
    if (productCheckResult) {
    addCart[i].textContent = "Added";
    addCart[i].disabled = true;
    trash[i].disabled = false;
    quantity[i].style.visibility = "hidden";
    }
    }
    
   
   function productCheck(item) {
    const productArrayResult = localStorage.getItem('products').includes(item)
    return productArrayResult
   }
   }


function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers){
    document.querySelector("#cart-btn span").textContent = productNumbers 
    }}

function cartNumbers(){
let productNum = localStorage.getItem('cartNumbers');
let productNumbers = parseInt(productNum);

if (productNumbers) {
localStorage.setItem('cartNumbers', productNumbers + 1);
document.querySelector("#cart-btn span").textContent = (productNumbers + 1).toString()

} else {
localStorage.setItem('cartNumbers', 1);
document.querySelector("#cart-btn span").textContent = "1"
}
}

function reduceCartNumbers(){
let productNum = localStorage.getItem('cartNumbers');
let productNumbers = parseInt(productNum);

if (productNumbers) {
localStorage.setItem('cartNumbers', productNumbers - 1);
document.querySelector("#cart-btn span").textContent = (productNumbers - 1).toString()
} 
}








