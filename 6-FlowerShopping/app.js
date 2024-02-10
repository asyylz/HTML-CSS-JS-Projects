"use strict";

fetch("products.json") // returns a promise so we can use then()
  .then(function (response) {
    return response.json(); // parses JSON response into native JavaScript and also returns a promise so we can use then() again
  })
  .then(function (data) {
    // saves  data to local storage
    localStorage.setItem("products", JSON.stringify(data));
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", "[]");
    }
  });

/* -------------- Setting Global Variables -------------- */
const products = JSON.parse(localStorage.getItem("products")) || [];
const cart = JSON.parse(localStorage.getItem("cart")) || [];

//let selectedProduct;

/* ----------------- Adding the product in teh cart ---------------- */
//const sectionProducts = document.querySelector("section.py-5");
const btnsAddToCart = document.querySelectorAll(".btnAdd");

console.log(btnsAddToCart);
btnsAddToCart.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const productId = parseInt(this.getAttribute("id"));

    addProductToCart(productId);
  });
});

let cartTotal = document.querySelector("span.badge");
cartTotal.textContent = 0;

function addProductToCart(productId) {
  const selectedProduct = products.find((product) => product.id === productId);
  if (!selectedProduct) {
    console.error(`Product with ID ${productId} not found.`);
    return; // Exit the function if the product is not found
  } else {
    const existingProduct = cart.find(
      (product) => product.id === selectedProduct.id
    );
    if (!existingProduct) {
      cart.push({ ...selectedProduct, saleQuantity: 1 });
    } else if (existingProduct.stockQuantity > existingProduct.saleQuantity) {
      existingProduct.saleQuantity++;
    } else {
      console.log(`${existingProduct.name} no more available in stock`);
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    cartTotal.textContent = cart.reduce((total, product) => {
      return total + product.saleQuantity;
    }, 0);
  }
}
//addProductToCart(8);
/* -------------------- Updating cart ------------------- */
function updateCart() {}
/* ----------------- Removing the product from the cart ---------------- */
function removeProductFromCart(productId) {
  const selectedProduct = cart.find((product) => product.id === productId);
  console.log(selectedProduct);
  if (!selectedProduct) {
    console.error(`Product with ID ${productId} not found.`);
    return; // Exit the function if the product is not found
  } else if (selectedProduct.saleQuantity > 1) {
    selectedProduct.saleQuantity--;
  } else {
    cart.splice(cart.indexOf(selectedProduct), 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
//removeProductFromCart(3);
