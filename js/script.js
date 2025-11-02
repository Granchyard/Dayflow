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

  randomPlayer1Count.textContent = "0";
  randomPlayer2Count.textContent = "0";

  randomButtonPlay.classList.add("btn-hidden", "btn-gone");

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
 
  randomButtonPlay.classList.remove("btn-gone");
  void randomButtonPlay.offsetWidth;
  randomButtonPlay.classList.remove("btn-hidden");
}

function showQueue(once = false) {
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
    cubeContainer.classList.add("random__cube-wrapper--charging");

    setTimeout(() => {
      cubeContainer.classList.remove("random__cube-wrapper--charging");

      const effects = document.querySelector(".random__effects");

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
        randomPlayer1Count.textContent = cubeNumber;
        cubeResultPlayerOne = cubeNumber;
      } else if (lastQueuePlayer === 2) {
        randomPlayer2Count.textContent = cubeNumber;
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