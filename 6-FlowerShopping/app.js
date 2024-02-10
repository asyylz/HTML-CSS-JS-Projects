"use strict";
/* ------------------------ JSON ------------------------ */

fetch("products.json") // returns a promise so we can use then()
  .then(function (response) {
    return response.json(); // parses JSON response into native JavaScript and also returns a promise so we can use then() again
  })
  .then(function (data) {
    for (let i = 1; i < data.length + 1; i++) {
      const imgURL = data[i - 1].image;
      const imgElement = document.getElementById(`${i}`);
      if (imgElement) {
        imgElement.src = imgURL;
      }
    }
    // saves  data to local storage
    localStorage.setItem("products", JSON.stringify(data));
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", "[]");
    }
  });

/* -------------- Setting Global Variables -------------- */
const products = JSON.parse(localStorage.getItem("products")) || [];
const cart = JSON.parse(localStorage.getItem("cart")) || [];

/* -------------------- addCartBtnId -------------------- */

/* ----------------- Adding product eventlistener option 1 ---------------- */
// const sectionProducts = document.querySelector("section.py-2");
// sectionProducts.addEventListener("click", function (e) {
//   console.log(e.target)
//   if (e.target && e.target.classList.contains("btnAdd")) {
//     const card = e.target.closest(".card");
//     const img = card.querySelector(".card-img-top");
//     const productId = parseInt(img.getAttribute("id"));
//     addProductToCart(productId);
//   }
// });
/* ----------------- Adding product eventlistener option 2 ---------------- */
const btnsAddToCart = document.querySelectorAll(".btnAdd");
btnsAddToCart.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const productId = parseInt(this.getAttribute("id"));
    addProductToCart(productId);
  });
});

/* ------------------- Top Cart Total ------------------- */
let cartTotal = document.querySelector("span.badge");
cartTotal.textContent = 0;

/* ------------ Product to cart funtionality ----------- */
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
      alert(`${existingProduct.name} no more available in stock`);
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
