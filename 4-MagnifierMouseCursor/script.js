function update(e) {
  var x = e.clientX || e.touches[0].clientX; // [0] client brings the first touch point
  var y = e.clientY || e.touches[0].clientY;
  console.log(x, y);

  document.documentElement.style.setProperty("--cursorX", x + "px");
  document.documentElement.style.setProperty("--cursorY", y + "px");
}

document.addEventListener("mousemove", update);
document.addEventListener("touchmove", update);
