"use strict";
/* ------------------------ JSON ------------------------ */
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("products", JSON.stringify(data));
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", "[]");
    }
  });

/* -------------- Setting Global Variables -------------- */
const products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ---------------------- Preloader --------------------- */
const loader = document.getElementById("preloader");
const body = document.querySelector("body.loading");
window.addEventListener("load", function () {
  setTimeout(function () {
    loader.style.opacity = "0";
    setTimeout(function () {
      loader.style.display = "none";
      body.style.overflow = "auto";
    }, 1000);
  }, 1500);
});

/* --------------- Event Listeners and Handlers --------------- */
document.addEventListener("DOMContentLoaded", function () {
  updateCart();
  retriveData();
  document.addEventListener("click", function (e) {
    // Check if the clicked element is a button
    if (e.target && e.target.classList.contains("btnAdd")) {
      e.preventDefault();
      const productId = e.target.closest(".col.mb-5").getAttribute("id");
      addProductToCart(productId);
      retriveData();
      //console.log("addButton clicked!");
    }
  });
});

document
  .querySelector("button[data-bs-toggle]")
  .addEventListener("click", retriveData);

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

/* ---------------------- Handlers ---------------------- */
function handleTrashIconClick(e) {
  const productId = e.target.closest(".card").getAttribute("id");
  const productRemove = cart.find(
    (product) => parseInt(productId) === product.id
  );
  if (productRemove.id) {
    removeProductFromCart(productRemove.id);
    retriveData();
  } else {
    console.log(`Product with ID ${productRemove.id} not found.`);
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
    retriveData();
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
    retriveData();
  }
}
/* -------------------- Functions ------------------- */
function updateCart() {
  const basketCount = document.querySelector("span.badge.basket");
  const basketTotal = document.querySelector("span.badge.basket-total");
  basketCount.textContent = totalItems();
  basketTotal.textContent = formatNumberValues(totalAmount());
}
function totalItems() {
  return cart.reduce((total, product) => total + product.saleQuantity, 0);
}

function totalAmount() {
  return cart.reduce(
    (total, product) => total + product.saleQuantity * product.price,
    0
  );
}

function retriveData() {
  const offCanvasBody = document.querySelector(".offcanvas-body");
  offCanvasBody.innerHTML = "";
  cart.forEach((product) => {
    const item = createCartItemHTML(product);
    offCanvasBody.insertAdjacentHTML("beforeend", item);
  });

  offCanvasBody.insertAdjacentHTML("beforeend", createCartTotalHTML());

  const container = document.querySelector("div.container .row");
  container.innerHTML = "";
  products.forEach((product) => {
    const displayProduct = createMainPageItemHTML(product);
    container.insertAdjacentHTML("beforeend", displayProduct);
  });
  updateCart();
}
function addProductToCart(productId) {
  const selectedProduct = products.find(
    (product) => product.id === parseInt(productId)
  );
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

/* ---------------- Creating DOM Element ---------------- */

function createCartItemHTML({ id, name, price, image, saleQuantity }) {
  return `
  <div class="card rounded-3 mb-2" id="${id}">
  <p class="fs-5 mt-1 ms-3">${name}</p>
    <div class="card-body">
      <div class="d-flex flex-row justify-content-around align-items-center">
        <div class="col-1 flex-fill text-align-center ">
          <img
            src="${image}"
            class="w-50 img-fluid rounded-3 alt="">
        </div>
        <div class="col-3 flex-fill">
        <div class="d-flex m-3">
          <button class="btn btn-link px-2 text-center fw-bold"
            onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
            <i class="bi bi-dash h4 icon-style"></i>
          </button>
          <input id="form1" min="0" name="quantity" value="${saleQuantity}" type="number"
                      class="form-control form-control-sm" />
            <button class="btn btn-link"
            onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
            <i class="bi bi-plus h4 icon-style"></i>
            </button>
  
            </div>
          <div class="d-flex  justify-content-center align-items-center">
          <h5 class="m-1">Product Total: ${formatNumberValues(
            price * saleQuantity
          )}</h5>
          <a href="#!" class="text-danger"><i class="bi bi-trash h4 icon-style"></i></a>
        </div>
        </div>
      </div>
    </div>
  </div>`;
}
function createMainPageItemHTML({ id, name, price, image }) {
  return `
  <div class="col mb-5" id="${id}">
  <div class="card h-100">
    <!-- Product image-->
    <img class="card-img-top" src="${image}" id="1" alt="..." />
    <!-- Product details-->
    <div class="card-body p-4">
      <div class="text-center">
        <!-- Product name-->
        <h5 class="fw-bolder">${name}</h5>
        <!-- Product price-->
        ${formatNumberValues(price)}
      </div>
    </div>
    <!-- Product actions-->
    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
      <div class="text-center"><a id="${id}" class="btn btn-outline-dark mt-auto btnAdd" href="#">Add to cart</a>
      </div>
    </div>
  </div>
</div>
  `;
}
function createCartTotalHTML() {
  const vatAmount = totalAmount() * 0.2;
  return `<div class="m-4 totalDiv-style">
<h5 class="m-3 d-flex justify-content-between"><span class="me-5">Total item:</span>${totalItems()}</h5>
<h5 class="m-3 d-flex justify-content-between"><span class="me-5">Subtotal:</span>${formatNumberValues(
    totalAmount() - vatAmount
  )}</h5>
<h5 class="m-3 d-flex justify-content-between"><span class="me-5">VAT (20%)</span>${formatNumberValues(
    vatAmount
  )}</h5>
<hr>
<h5 class="m-3 d-flex justify-content-between"><span class="me-5">Total:</span>${formatNumberValues(
    totalAmount()
  )}</h5>
</div>`;
}
