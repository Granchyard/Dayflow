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

const randomPlayer1 = document.querySelector(".random__player1");
const randomPlayer2 = document.querySelector(".random__player2");

const randomPlayer1Count = randomPlayer1.querySelector(
  ".random__player1-count"
);
const randomPlayer2Count = randomPlayer2.querySelector(
  ".random__player2-count"
);

const randomPlayer1Ready = randomPlayer1.querySelector(
  ".random__player1-ready"
);
const randomPlayer2Ready = randomPlayer2.querySelector(
  ".random__player2-ready"
);

const randomWinner = document.querySelector(".random__winner");
const randomWinnerName = document.querySelector(".random__winner-name");

const randomStreak = document.querySelector(".random__streak");
const randomHistory = document.querySelector(".random__history");

const randomButtonStart = document.querySelector(".random__button-start");
const randomButtonPlay = document.querySelector(".random__button-play");
