"use strict";

document.addEventListener(
  "touchmove",
  function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);

["gesturestart", "gesturechange", "gestureend"].forEach((type) =>
  document.addEventListener(type, (e) => e.preventDefault(), { passive: false })
);

document.addEventListener(
  "dblclick",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);

//sidebar

const body = document.body;
const overlay = document.querySelector(".overlay");
const burgerButton = document.querySelector(".header__burger-button");
const sidebar = document.querySelector(".sidebar");

const close = () => {
  body.classList.remove("sidebar-open");
};

const toggle = () => {
  body.classList.toggle("sidebar-open");
};

burgerButton.addEventListener("click", toggle);
overlay.addEventListener("click", close);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") close();
});
