let submit = document.querySelector("#submit-button")
let clear = document.querySelector("#clear-button")

let cartContainer = document.querySelector("#cart-container")
let cartItems = JSON.parse(localStorage.getItem('products'));

onLoadCart()

buttonload()

function buttonload() {
if (cartItems === null) {
	document.querySelector(".cart-order").style.visibility = "hidden";
	
}
}


function displayCart(){
if (cartItems === null) {
        cartContainer.innerHTML = "";
 } else {
        cartItems = Object.values(cartItems).map(item => {
            cartContainer.innerHTML += `
            <div class="grid-container">
            <div class="grid-column1">
            <div class="grid-item1">
                  <h3 id="cart-name" name="name">${item.productName}</h3>
                  <h6 id="cart-id" name="code">${item.id}</h6>
            </div>
          </div>
          <div class="grid-column3">
            <div class="grid-item5">
              <input type="number" id="cart-quantity" name="quantity" min="1" max="1000" style="text-align: center;" value=${item.amount}>
            </div>
            <div class="grid-item4">
                  <button id="cart-trash" class="trash-btn"><i class="bi bi-trash"></i></button>
            </div>
          </div>
          </div> `
        })
    } 
}

displayCart()


 
let cartTrash = document.querySelectorAll("#cart-trash");
let cartId = document.querySelectorAll("#cart-id");
let cartQuantity = document.querySelectorAll("#cart-quantity");
let cartName = document.querySelectorAll("#cart-name");


for (let i=0; i < cartTrash.length; i++) {

    cartTrash[i].addEventListener('click', () => {
	let ident = cartId[i].textContent;
    let gridCont = document.querySelectorAll(".grid-container")
    gridCont[i].style.display = "none";
    

	reduceCartNumbers()
	
	let cartItems = JSON.parse(localStorage.getItem('products'));
	let cart = Object.values(cartItems)	

function removeItem(ident){
	cart = cart.filter(item => item.id !==ident );
	return cart	
}
    
let newArr = removeItem(ident)

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
}else{
	localStorage.removeItem('products')
    gridCont[i].style.display = "none";
    submit.style.visibility = "hidden"
    clear.style.visibility = "hidden"

}	
    
})
}



for (let i=0; i < cartQuantity.length; i++) {

    cartQuantity[i].addEventListener('change', () => {
	    let prod = cartName[i].textContent;
		let numb = cartQuantity[i].value;
		let ident = cartId[i].textContent;
		let prodObject = {id:ident, productName:prod, amount:numb};
	let cartItems = JSON.parse(localStorage.getItem('products'))
	let cart = Object.values(cartItems)	

function removeItem(ident){
	cart = cart.filter(item => item.id !==ident );
	return cart	
}
const convertArray = (array, key) => {
	const initialValue = {}
	return array.reduce((obj, item) => {
		return {
			...obj,
			[item[key]]:item,
		};
	}, initialValue)}

cartItems = convertArray(removeItem(ident), 'id' );
if (cartItems != null) {
			cartItems = {...cartItems, [prodObject.id]:prodObject}}
				else { cartItems = {[prodObject.id]:prodObject}}
		localStorage.setItem('products',JSON.stringify(cartItems))
})
}


function reduceCartNumbers(){
    let productNum = localStorage.getItem('cartNumbers');
    let productNumbers = parseInt(productNum);
    
    if (productNumbers) {
    localStorage.setItem('cartNumbers', productNumbers - 1);
    document.querySelector("#cart-btn span").textContent = (productNumbers - 1).toString();
	document.querySelector("#itemno").textContent = (productNumbers - 1).toString()
    } 
    }

function onLoadCart() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers){
    document.querySelector("#cart-btn span").textContent = productNumbers;
	document.querySelector("#itemno").textContent = productNumbers 
    } else {
    document.querySelector("#cart-btn span").textContent = 0;
	document.querySelector("#itemno").textContent = 0 
    }
}


let yesClear = document.querySelector("#yesClear")
let clearModal = document.querySelector("#myClearModal")
yesClear.addEventListener('click', () => {
    localStorage.clear();
    cartContainer.style.display = "none";
    clearModal.style.visibility = "hidden";
    submit.style.visibility = "hidden";
    clear.style.visibility = "hidden";
    onLoadCart()
})

let yesSubmit = document.querySelector("#yesSubmit");
let submitModal = document.querySelector("#mySubmitModal");


   
yesSubmit.addEventListener('click', () => {
cartItems = JSON.parse(localStorage.getItem('products'))
let order = Object.values(cartItems)
document.querySelector("#nm").value = JSON.stringify(order)
bagNum = order.length
document.querySelector("#bag").value = JSON.stringify(bagNum)
if (document.querySelector("#nm").value === JSON.stringify(order) && document.querySelector("#bag").value === JSON.stringify(bagNum)) {
    document.querySelector("#submitForm").submit();
    localStorage.clear();
    submitModal.style.visibility = "hidden";
}

})
   






    












