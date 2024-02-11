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

/* -------------------- Updating cart ------------------- */
let basketCount = document.querySelector("span.badge.basket");
let basketTotal = document.querySelector("span.badge.basket-total");
basketCount.textContent = 0;
basketTotal.textContent = "£0.00";

function updateCart() {
  basketCount.textContent = cart.reduce((total, product) => {
    return total + product.saleQuantity;
  }, 0);

  const totalPrice = (basketTotal.textContent = cart.reduce(
    (total, product) => {
      return total + product.saleQuantity * product.price;
    },
    0
  ));
  basketTotal.textContent = `£${totalPrice.toFixed(2)}`;

  return basketCount.textContent, basketTotal.textContent;
}

document.addEventListener("DOMContentLoaded", function () {
  updateCart();
});
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

    updateCart();
  }
}

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

/* -------------- Retriving  data for carte ------------- */
const offCanvasBody = document.querySelector(".offcanvas-body");
const btnCanvas = document.querySelector("button[data-bs-toggle]");
btnCanvas.addEventListener("click", retriveCartData());

function retriveCartData() {
  offCanvasBody.innerHTML = "";
  console.log(cart);
  cart.forEach((product) => {
    const item = `
<div class="card rounded-3 mb-2">
<p class="fs-5 mt-1 ms-3">${product.name}</p>
  <div class="card-body">
    <div class="d-flex flex-row justify-content-around align-items-center">
      <div class="col-1 flex-fill text-align-center ">
        <img
          src="${product.image}"
          class="w-50 img-fluid rounded-3 alt="">
      </div>
      <div class="col-1 flex-fill">
      <div class="d-flex m-3">
        /* ----------------------- + icon ----------------------- */
        <button class="btn btn-link px-2 text-center fw-bold"
          onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
          <i class="bi bi-dash h4"></i>
        </button>
        /* ------------------- increment input ------------------ */
        <input id="form1" min="0" name="quantity" value="${
                    product.saleQuantity
                  }" type="number"
                    class="form-control form-control-sm" />
        /* ----------------------- - icon ----------------------- */
          <button class="btn btn-link"
          onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
          <i class="bi bi-plus h4"></i>
          </button>

          </div>
        <div class="d-flex  justify-content-center align-items-center">
        <h5 class="m-4">£ ${product.price * product.saleQuantity}</h5>
        <a href="#!" class="text-danger"><i class="bi bi-trash h4"></i></a>
      </div>
      </div>
    </div>
  </div>
</div>`;
    offCanvasBody.innerHTML += item;
  });

  updateCart();
  offCanvasBody.innerHTML += `<h5 class="m-4">${basketCount.textContent}</h5>`;
  offCanvasBody.innerHTML += `<h5 class="m-4">${basketTotal.textContent}</h5>`;
}

// const item = `
// <div class="card rounded-3 mb-2">
// <p class="fs-5 mb-2">${product.name}</p>
//   <div class="card-body p-4">
//     <div class="row d-flex justify-content-between align-items-center">
//       <div class="col-md-2 col-lg-2 col-xl-2">
//         <img
//           src="${product.image}"
//           class="img-fluid rounded-3" alt="Cotton T-shirt">
//       </div>
//       <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
//         <button class="btn btn-link px-2"
//           onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
//           <i class="bi bi-dash"></i>
//         </button>
//         <input id="form1" min="0" name="quantity" value="${
//           product.saleQuantity
//         }" type="number"
//           class="form-control form-control-sm" />

//         <button class="btn btn-link px-2"
//           onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
//           <i class="bi bi-plus"></i>
//         </button>
//       </div>
//       <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
//         <h5 class="mb-0">£ ${product.price * product.saleQuantity}</h5>
//       </div>
//       <div class="col-md-1 col-lg-1 col-xl-1 text-end">
//         <a href="#!" class="text-danger"><i class="bi bi-trash"></i></a>
//       </div>
//     </div>
//   </div>
// </div>`;
