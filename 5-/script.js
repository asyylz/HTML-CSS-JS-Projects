/* ----------------------- cursor ----------------------- */
// function update(e) {
//   var x = e.clientX || e.touches[0].clientX; // [0] client brings the first touch point
//   var y = e.clientY || e.touches[0].clientY;
//   console.log(x, y);

//   document.documentElement.style.setProperty("--cursorX", x + "px");
//   document.documentElement.style.setProperty("--cursorY", y + "px");
// }

// document.addEventListener("mousemove", update);
// document.addEventListener("touchmove", update)

/* --------------------- blacklayer --------------------- */

const blackLayer = document.querySelector(":root:before ");
console.log(blackLayer);
const body = document.querySelector("body");

const black = () => {
  body.style.opacity = 0.5;
  body.removeEventListener("mousemove", black, false);
};
body.addEventListener("mousemove", black);


body.addEventListener("click", () => {
  // Set the background color to transparent
  body.style.opacity = 1;
  document.documentElement.style.setProperty("--cursorX", "transparent");
  document.documentElement.style.setProperty("--cursorY", "transparent");
});


const btn = document.querySelector(".btn");
const closeIcon = document.querySelector(".close-icon");
const trailerContainer = document.querySelector(".trailer-container");
const video = document.querySelector("video");

btn.addEventListener("click", () => {
  trailerContainer.classList.remove("active");
});

closeIcon.addEventListener("click", () => {
  trailerContainer.classList.add("active");
  video.pause();
  video.currentTime = 0;
});
