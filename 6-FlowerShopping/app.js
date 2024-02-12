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

/* ----------------- Adding product eventlistener option 1 ---------------- */
//ASK
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
    retriveCartData();
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

  //return basketCount.textContent, basketTotal.textContent; //ASK
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
    updateCart();
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

/* ----------------- Removing/Decreasing the product from the cart ---------------- */
function decreaseAmountOfProductFromCart(productId) {
  const selectedProduct = cart.find((product) => product.id === productId);
  console.log(selectedProduct);
  if (!selectedProduct) {
    console.error(`Product with ID ${productId} not found.`);
    return; // Exit
  } else if (selectedProduct.saleQuantity > 1) {
    selectedProduct.saleQuantity--;
  } else {
    cart.splice(cart.indexOf(selectedProduct), 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeProductFromCart(productId) {
  const selectedProduct = cart.find((product) => product.id === productId);
  console.log(selectedProduct);
  if (!selectedProduct) {
    console.error(`Product with ID ${productId} not found.`);
    return; // Exit
  } else {
    cart.splice(cart.indexOf(selectedProduct), 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ------------------------------------------------------ */
/*           RETRIEVING DATA FROM LOCAL STORAGE           */
/* ----------------- FOR CART OFFCANVAS ----------------- */
/* ------------------------------------------------------ */
const offCanvasBody = document.querySelector(".offcanvas-body");
const btnCanvas = document.querySelector("button[data-bs-toggle]");
btnCanvas.addEventListener("click", retriveCartData());

function retriveCartData() {
  offCanvasBody.innerHTML = "";
  cart.forEach((product) => {
    /* ----------------- Cart HTML Template ----------------- */
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
    offCanvasBody.innerHTML += item;
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

  /* ---------------- trash icons selected ---------------- */
  const btnsTrush = document.querySelectorAll("i.bi.bi-trash.h4");
  console.log(btnsTrush);
  btnsTrush.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const parent = e.target.closest(".card-body");
      const img = parent.querySelector("img");
      cart.find((product) => img.src.includes(product.image));
      const productRemove = cart.find((product) =>
        img.src.includes(product.image.slice(1))
      );
      const productId = productRemove.id;
      removeProductFromCart(productId);
      retriveCartData();
    });
  });

  /* ----------------Minus icon select and functionality--------------- */
  const btnsMinus = document.querySelectorAll("i.bi.bi-dash.h4");
  btnsMinus.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const parent = e.target.closest(".card-body");
      const img = parent.querySelector("img");

      cart.find((product) => img.src.includes(product.image));
      const productRemove = cart.find((product) =>
        img.src.includes(product.image.slice(1))
      );
      const productId = productRemove.id;
      decreaseAmountOfProductFromCart(productId);
      retriveCartData();
    });
  });

  /* --------------Plus icon select and functionality--------------- */
  const btnsPlus = document.querySelectorAll("i.bi.bi-plus.h4");
  btnsPlus.forEach((btn) => {
    btn.addEventListener("click", function (e) {
    e.preventDefault();
    const parent = e.target.closest(".card-body");
    const img = parent.querySelector("img");

    cart.find((product) => img.src.includes(product.image));
    const productAdded = cart.find((product) =>
      img.src.includes(product.image.slice(1))
    );
    const productId = productAdded.id;
    addProductToCart(productId);
    retriveCartData();
  });
})
}

function formatNumberValues(number) {
  return number.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}
