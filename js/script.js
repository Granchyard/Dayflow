"use strict";


//sidebar

const body = document.body;
const overlay = document.querySelector(".overlay");
const header = document.querySelector(".header");
const burgerButton = document.querySelector(".header__burger-button");
const sidebar = document.querySelector(".sidebar");
const randomGame = document.querySelector(".sidebar__random-game");
const homeButton = document.querySelector(".header__home-button");

// register

const headerPerson = document.querySelector(".header__person");
const signInButton = document.querySelector(".btn-enter");
const signUpButton = document.querySelector(".btn-register");
const formBox = document.querySelector(".register__form-box");
const passwordWrapper = document.querySelectorAll(
  ".register__pasword-block-passwort-wrapper",
);
const registerFormEnter = document.querySelector(".register__form-enter");
const registerFormRegister = document.querySelector(".register__form-register");
const rememberMeCheckbox = document.getElementById("rememberMe");

const enterUsernameInput = document.querySelector(".enter-username");
const enterPasswordInput = document.querySelector(".enter-password");
const registerUsernameInput = document.querySelector(".register-username");
const registerPasswordInput = document.querySelector(".register-password");
const registerConfirmPasswordInput = document.querySelector(
  ".register-confirm-password",
);
const logoutBtn = document.querySelector(".person-menu-button-logout");

let keyboardMode = false;
let storageWarned = false;

const AUTH_KEY = "authUser";

const closeSidebar = () => {
  body.classList.remove("sidebar-open");
};

const toggleSidebar = () => {
  body.classList.toggle("sidebar-open");
};

const closePersonMenu = () => {
  body.classList.remove("person-menu-open");
};

const closeRegister = () => {
  body.classList.remove("register-active");
  formBox?.classList.remove("active-form");
};

const toggleRegister = () => {
  body.classList.toggle("register-active");
};

burgerButton?.addEventListener("click", toggleSidebar);
overlay?.addEventListener("click", closeSidebar);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});

randomGame?.addEventListener("click", () => {
  closeSidebar();
  body.classList.add("active-random");
  body.classList.remove("active-home");
});

homeButton?.addEventListener("click", () => {
  closeSidebar();
  body.classList.add("active-home");
  body.classList.remove("active-random");
});

const randomPlayer1 = document.querySelector(".random__player1");
const randomPlayer2 = document.querySelector(".random__player2");

const randomPlayer1Count = randomPlayer1?.querySelector(
  ".random__player1-count"
);
const randomPlayer2Count = randomPlayer2?.querySelector(
  ".random__player2-count"
);



const randomWinner = document.querySelector(".random__winner");
const randomWinnerName = document.querySelector(".random__winner-name");



const randomButtonStart = document.querySelector(".random__button-start");
const randomButtonPlay = document.querySelector(".random__button-play");

const randomPlayerOne = document.querySelector(".random__player1-name");
const randomPlayerTwo = document.querySelector(".random__player2-name");

let playDeadlineId = null;

function startPlayDeadline(ms = 15000) {
  cancelPlayDeadline();
  playDeadlineId = setTimeout(() => {
    restartGame("play-timeout");
  }, ms);
}

function cancelPlayDeadline() {
  if (playDeadlineId) {
    clearTimeout(playDeadlineId);
    playDeadlineId = null;
  }
}

function restartGame(reason = "") {
  cancel();
  cancelPlayDeadline();

  lastQueuePlayer = null;
  forceQueuePlayer = null;
  cubeResultPlayerOne = null;
  cubeResultPlayerTwo = null;
  showQueue._doneOnce = false;

  if (randomPlayer1Count) randomPlayer1Count.textContent = "0";
  if (randomPlayer2Count) randomPlayer2Count.textContent = "0";

  if (randomButtonPlay)
    randomButtonPlay.classList.add("btn-hidden", "btn-gone");

  if (randomButtonStart)
    randomButtonStart.classList.remove("btn-hidden", "btn-gone");

  attachPlayHandler();
}

let queueDelayId = null;
let queueActiveId = null;

function cancel() {
  if (queueDelayId) {
    clearTimeout(queueDelayId);
    queueDelayId = null;
  }
  if (queueActiveId) {
    clearTimeout(queueActiveId);
    queueActiveId = null;
  }

  randomPlayer1?.classList.remove("queue-active");
  randomPlayer2?.classList.remove("queue-active");
}

let lastQueuePlayer = null;
let forceQueuePlayer = null;

function showPlay() {
  if (!randomButtonPlay) return;
  randomButtonPlay.classList.remove("btn-gone");
  void randomButtonPlay.offsetWidth;
  randomButtonPlay.classList.remove("btn-hidden");
}

function showQueue(once = false) {

  if (!randomPlayer1 || !randomPlayer2) return;
  if (!randomButtonPlay) return;

  if (once) {
    if (showQueue._doneOnce) return;
    showQueue._doneOnce = true;
  }

  let queue = Math.floor(Math.random() * 2) + 1; // 1 or 2

  if (forceQueuePlayer === 1 || forceQueuePlayer === 2) {
    queue = forceQueuePlayer;
    forceQueuePlayer = null;
  }
  lastQueuePlayer = queue;

  if (queue === 1) {
    // Player 1 starts
    queueDelayId = setTimeout(() => {
      randomPlayer1.classList.add("queue-active");

      startPlayDeadline(15000);
      attachPlayHandler();

      queueActiveId = setTimeout(() => {
        randomPlayer1.classList.remove("queue-active");
        queueActiveId = null;
      }, 15000);
      queueDelayId = null;
    }, 100);
  } else {
    // Player 2 starts
    queueDelayId = setTimeout(() => {
      randomPlayer2.classList.add("queue-active");

      startPlayDeadline(15000);
      attachPlayHandler();

      queueActiveId = setTimeout(() => {
        randomPlayer2.classList.remove("queue-active");
        queueActiveId = null;
      }, 15000);
      queueDelayId = null;
    }, 100);
  }
}

let cubeResultPlayerOne = null;
let cubeResultPlayerTwo = null;

//cube

function playCubeAnimation() {
  return new Promise((resolve) => {
    const cubeContainer = document.querySelector(".random__cube-container");
    if (!cubeContainer) return resolve({ cubeEnd: false });
    cubeContainer.classList.add("random__cube-container--charging");

    setTimeout(() => {
      cubeContainer.classList.remove("random__cube-container--charging");

      const effects = document.querySelector(".random__effects");
      if (!effects) return resolve({ cubeEnd: false });
      const group = document.createElement("div");
      group.classList.add("random__energy-group");
      effects.appendChild(group);

      const holo = document.createElement("div");
      holo.classList.add("random__holo-number");

      const cubeNumber = (holo.innerText = Math.floor(Math.random() * 100));

      group.appendChild(holo);

      for (let i = 0; i < 18; i++) {
        const line = document.createElement("div");
        line.classList.add("random__energy-line");

        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        line.style.left = `${offsetX}px`;
        line.style.top = `${offsetY}px`;
        line.style.height = 30 + Math.random() * 40 + "px";

        group.appendChild(line);
      }

      setTimeout(() => group.remove(), 2200);

      resolve({ cubeEnd: true });

      if (lastQueuePlayer === 1) {
        if (randomPlayer1Count) randomPlayer1Count.textContent = String(cubeNumber);
        cubeResultPlayerOne = cubeNumber;
      } else if (lastQueuePlayer === 2) {
        if (randomPlayer2Count) randomPlayer2Count.textContent = String(cubeNumber);
        cubeResultPlayerTwo = cubeNumber;
      }

      if (cubeResultPlayerOne !== null && cubeResultPlayerTwo !== null) {
        if (cubeResultPlayerOne > cubeResultPlayerTwo) {
          randomWinner.classList.add("show-winner");
          randomWinnerName.textContent = "@Player1";

          setTimeout(() => {
            randomWinner.classList.remove("show-winner");
          }, 10000);
        } else if (cubeResultPlayerOne < cubeResultPlayerTwo) {
          randomWinner.classList.add("show-winner");
          randomWinnerName.textContent = "@Player2";

          setTimeout(() => {
            randomWinner.classList.remove("show-winner");
          }, 10000);
        } else {
          randomWinner.classList.add("show-winner");
          randomWinnerName.textContent = "Friendship";

          setTimeout(() => {
            randomWinner.classList.remove("show-winner");
          }, 10000);
        }
      }

      randomWinner.addEventListener(
        "transitionend",
        () => {
          restartGame("winner-finished");
        },
        { once: true }
      );
    }, 2000);
  });
}

attachPlayHandler();
randomButtonStart?.addEventListener("click", () => {
  if (randomWinner.classList.contains("show-winner")) {
    randomWinner.classList.remove("show-winner");
  }

  const onEnd = (e) => {
    if (e.target !== randomButtonStart || e.propertyName !== "opacity") return;
    randomButtonStart.classList.add("btn-gone");
    showPlay();
    showQueue();
  };

  randomButtonStart.addEventListener("transitionend", onEnd, { once: true });
  randomButtonStart.classList.add("btn-hidden");
});

let playLocked = false;

async function onPlayClick() {
  if (playLocked) return;
  playLocked = true;

  cancelPlayDeadline();
  await playCubeAnimation();
  playLocked = false;
  cancel();

  if (lastQueuePlayer === 1) {
    forceQueuePlayer = 2;
  } else if (lastQueuePlayer === 2) {
    forceQueuePlayer = 1;
  }

  showQueue(true);
}

document.addEventListener("DOMContentLoaded", () => {
  body.classList.add("active-home");
  body.classList.remove("active-random");
});

function attachPlayHandler() {
  if (!randomButtonPlay) return;
  randomButtonPlay.removeEventListener("click", onPlayClick);
  randomButtonPlay.addEventListener("click", onPlayClick, { once: true });
}

// ===== LISTENERS =====

// disable zooming

document.addEventListener(
  "touchmove",
  function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false },
);

["gesturestart", "gesturechange", "gestureend"].forEach((type) =>
  document.addEventListener(type, (e) => e.preventDefault(), {
    passive: false,
  }),
);

document.addEventListener(
  "dblclick",
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);