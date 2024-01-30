const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const header = document.querySelector(".header");
const button = document.querySelector('button[type="submit"]');
const cotton = document.querySelector(".cotton");
const petals = document.querySelector(".petals");
const yellow = document.querySelector(".yellow");
const body = document.querySelector("body");
const allSpansInHeader = document.querySelectorAll("#search-form span");

async function searchWikipeida(query) {
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

  const reponse = await fetch(endpoint);

  if (!reponse.ok) {
    throw new Error("Faild to fetch search results form wikipedia API.");
  }

  const json = await reponse.json();
  return json;
}

function displayResults(results) {
  // Remove the loading spinner
  searchResults.innerHTML = "";

  results.forEach((result) => {
    // Ensure the result object has the expected properties
    if (result && result.pageid) {
      const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
      const titleLink = `<a href="${url}" target="_blank" rel="noopener">${result.title}</a>`;
      const urlLink = `<a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>`;

      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `
        <h3 class="result-title">${titleLink}</h3>
        ${urlLink}
        <p class="result-snippet">${result.snippet}</p>
      `;

      searchResults.appendChild(resultItem);
    }
  });
}


searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = "<p>Please enter a valid search term. </p>";
    return;
  }

  searchResults.innerHTML = "<div class='spinner'>Loading ... </div>";

  try {
    const results = await searchWikipeida(query);

    if (results.query.searchinfo.totalhits === 0) {
      searchResults.innerHTML = "<p>No results found. </p>";
    } else {
      displayResults(results.query.search);
    }
  } catch (error) {
    console.error(error);
    searchResults.innerHTML = `<p>An error occured while searching. Please try again later. </p>`;
  }
});

/* ----------------- lazy loading header ---------------- */
function lazyLoadHeader() {
  //header.style.transition = "all 2s ease-in-out"; //this part added to css file
  setTimeout(() => {
    header.style.opacity = 1;
    //header.style.transform = "translateY(0)";
  }, 50);
  setTimeout(() => {
    header.style.transition = "";
  }, 2000);
}
document.addEventListener("DOMContentLoaded", lazyLoadHeader);

/* ------------------ theme application ----------------- */
allSpansInHeader.forEach((span) => {
  span.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("cotton")) {
      body.classList.add("cotton-theme");
      body.classList.remove("petals-theme");
      body.classList.remove("yellow-theme");
      //body.style.backgroundImage = "url(./assests/fluffy-cotton-bunch.jpg)";
      lazyLoadHeader();
    } else if (target.classList.contains("petals")) {
      body.classList.add("petals-theme");
      body.classList.remove("cotton-theme");
      body.classList.remove("yellow-theme");
      // body.style.backgroundImage = "url(./assests/petals.jpg)";
      lazyLoadHeader();
    } else if (target.classList.contains("yellow")) {
      body.classList.add("yellow-theme");
      body.classList.remove("cotton-theme");
      body.classList.remove("petals-theme");
      //body.style.backgroundImage = "url(./assests/yellow-flower.jpg)";
      lazyLoadHeader();
    }
  });
});
