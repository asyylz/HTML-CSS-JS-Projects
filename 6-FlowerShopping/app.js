"use strict";
/* ------------------------ JSON ------------------------ */
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    populateProductImages(data);
    localStorage.setItem("products", JSON.stringify(data));
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", "[]");
    }
  });

/* -------------- Setting Global Variables -------------- */
const products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* --------------- Event Listeners and Handlers --------------- */
document.addEventListener("DOMContentLoaded", function () {
  updateCart();
  retriveCartData();
});

document
  .querySelector("button[data-bs-toggle]")
  .addEventListener("click", retriveCartData);

document
  .querySelector(".offcanvas-body")
  .addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.matches("i.bi.bi-trash.h4")) {
      handleTrashIconClick(e);
    } else if (e.target.matches("i.bi.bi-dash.h4")) {
      handleMinusIconClick(e);
    } else if (e.target.matches("i.bi.bi-plus.h4")) {
      handlePlusIconClick(e);
    }
  });

document.querySelectorAll(".btnAdd").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const productId = parseInt(this.getAttribute("id"));
    addProductToCart(productId);
    retriveCartData();
  });
});

/* -------------------- Functions ------------------- */
function populateProductImages(data) {
  for (let i = 0; i < data.length; i++) {
    const imgURL = data[i].image;
    const imgElement = document.getElementById(`${i + 1}`);
    if (imgElement) {
      imgElement.src = imgURL;
    }
  }
}

let basketCount = document.querySelector("span.badge.basket");
let basketTotal = document.querySelector("span.badge.basket-total");
basketCount.textContent = 0;
basketTotal.textContent = "£0.00";
function updateCart() {
  basketCount.textContent = cart.reduce(
    (total, product) => total + product.saleQuantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, product) => total + product.saleQuantity * product.price,
    0
  );
  basketTotal.textContent = `£${totalPrice.toFixed(2)}`;

  //return basketCount.textContent, basketTotal.textContent; //ASK
}

function retriveCartData() {
  const offCanvasBody = document.querySelector(".offcanvas-body");
  offCanvasBody.innerHTML = "";
  cart.forEach((product) => {
    const item = createCartItemHTML(product);
    offCanvasBody.insertAdjacentHTML("afterbegin", item);
  });
  updateCart();
  const total = parseFloat(basketTotal.textContent.replace("£", ""));
  const vatAmount = total * 0.2; //VAT 20%
  const totalDiv = `<div class="m-4 totalDiv-style">
  <h5 class="m-3 d-flex justify-content-between"><span class="me-5">Total item:</span>${
    basketCount.textContent
  }</h5>
  <h5 class="m-3 d-flex justify-content-between"><span class="me-5">Subtotal:</span>${formatNumberValues(
    total - vatAmount
  )}</h5>
  <h5 class="m-3 d-flex justify-content-between"><span class="me-5">VAT (20%)</span>${formatNumberValues(
    vatAmount
  )}</h5>
  <hr>
  <h5 class="m-3 d-flex justify-content-between"><span class="me-5">Total:</span>${formatNumberValues(
    total
  )}</h5>
  </div>`;
  offCanvasBody.innerHTML += totalDiv;
}

function createCartItemHTML(product) {
  return `
  <div class="card rounded-3 mb-2">
  <p class="fs-5 mt-1 ms-3">${product.name}</p>
    <div class="card-body">
      <div class="d-flex flex-row justify-content-around align-items-center">
        <div class="col-1 flex-fill text-align-center ">
          <img
            src="${product.image}"
            class="w-50 img-fluid rounded-3 alt="">
        </div>
        <div class="col-3 flex-fill">
        <div class="d-flex m-3">
          <button class="btn btn-link px-2 text-center fw-bold"
            onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
            <i class="bi bi-dash h4 icon-style"></i>
          </button>
          <input id="form1" min="0" name="quantity" value="${
            product.saleQuantity
          }" type="number"
                      class="form-control form-control-sm" />
            <button class="btn btn-link"
            onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
            <i class="bi bi-plus h4 icon-style"></i>
            </button>
  
            </div>
          <div class="d-flex  justify-content-center align-items-center">
          <h5 class="m-1">Product Total: ${formatNumberValues(
            product.price * product.saleQuantity
          )}</h5>
          <a href="#!" class="text-danger"><i class="bi bi-trash h4 icon-style"></i></a>
        </div>
        </div>
      </div>
    </div>
  </div>`;
}

function handleTrashIconClick(e) {
  const parent = e.target.closest(".card-body");
  const img = parent.querySelector("img");
  const productRemove = cart.find((product) =>
    img.src.includes(product.image.slice(1))
  );
  if (productRemove) {
    removeProductFromCart(productRemove.id);
    retriveCartData();
  }
}

function handleMinusIconClick(e) {
  const parent = e.target.closest(".card-body");
  const img = parent.querySelector("img");
  const productRemove = cart.find((product) =>
    img.src.includes(product.image.slice(1))
  );
  if (productRemove) {
    decreaseAmountOfProductFromCart(productRemove.id);
    retriveCartData();
  }
}

function handlePlusIconClick(e) {
  const parent = e.target.closest(".card-body");
  const img = parent.querySelector("img");
  const productAdd = cart.find((product) =>
    img.src.includes(product.image.slice(1))
  );
  if (productAdd) {
    addProductToCart(productAdd.id);
    retriveCartData();
  }
}

function addProductToCart(productId) {
  const selectedProduct = products.find((product) => product.id === productId);
  if (!selectedProduct) {
    console.error(`Product with ID ${productId} not found.`);
    return;
  }

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
}

function decreaseAmountOfProductFromCart(productId) {
  const selectedProduct = cart.find((product) => product.id === productId);
  if (!selectedProduct) {
    console.error(`Product with ID ${productId} not found.`);
    return;
  }

  if (selectedProduct.saleQuantity > 1) {
    selectedProduct.saleQuantity--;
  } else {
    removeProductFromCart(productId);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeProductFromCart(productId) {
  cart = cart.filter((product) => product.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatNumberValues(number) {
  return number.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}
