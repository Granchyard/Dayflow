"use strict";

//sidebar

const body = document.body;
const overlay = document.querySelector(".overlay");
const burgerButton = document.querySelector(".header__burger-button");
const sidebar = document.querySelector(".sidebar");

const close = () => {
  body.classList.remove("sidebar-open");
}

const toggle = () => {
  body.classList.toggle("sidebar-open");
}

burgerButton.addEventListener("click", toggle);
overlay.addEventListener("click", close);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") close();
});
