"use strict";


//sidebar

const body = document.body;
const overlay = document.querySelector(".overlay");
const header = document.querySelector(".header");
const burgerButton = document.querySelector(".header__burger-button");
const sidebar = document.querySelector(".sidebar");
const randomGame = document.querySelector(".sidebar__random-game");

// account

const accountMenu = document.querySelector(".person-menu-button-account");
const accountCancelButton = document.querySelector(".account__cancel-button");
const accountSaveButton = document.querySelector(".account__save-button");
const avatarBox = document.querySelector(".account__avatar-list-container");
const accountAvatarImgBlock = document.querySelector(
  ".account__avatar-img-block",
);

const homeButton = document.querySelector(".header__home-button");

// register

const headerPerson = document.querySelector(".header__person");
const signInButton = document.querySelector(".btn-enter");
const signUpButton = document.querySelector(".btn-register");
const formBox = document.querySelector(".register__form-box");
const passwordWrapper = document.querySelectorAll(
  ".register__password-block-password-wrapper",
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

burgerButton?.addEventListener("click", () => {
  closeRegister();
  closePersonMenu();
  toggleSidebar();
});

overlay?.addEventListener("click", () => {
  closeSidebar();
  closeRegister();
  closePersonMenu();

  if (!keyboardMode && document.activeElement?.blur) {
    document.activeElement.blur();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSidebar();
    closeRegister();
    closePersonMenu();
  }
});

randomGame?.addEventListener("click", () => {
  closeSidebar();
  closeRegister();
  closePersonMenu();

  body.classList.add("active-random");
  body.classList.remove("active-home");
});

homeButton?.addEventListener("click", () => {
  closeSidebar();
  closeRegister();
  closePersonMenu();

  body.classList.add("active-home");
  body.classList.remove("active-random");
});

headerPerson?.addEventListener("click", () => {
  closeSidebar();

  if (getAuth()) {
    body.classList.toggle("person-menu-open");
  } else {
    toggleRegister();
    formBox.classList.remove("active-form");
    formsValidation.clearForm(registerFormEnter);
    formsValidation.clearForm(registerFormRegister);
  }
});

signUpButton?.addEventListener("click", () => {
  formBox.classList.add("active-form");
  formsValidation.clearForm(registerFormEnter);
});

signInButton?.addEventListener("click", () => {
  formBox.classList.remove("active-form");
  formsValidation.clearForm(registerFormRegister);
});

passwordWrapper.forEach((block) => {
  const input = block.querySelector(".form-password");
  const eyeIcon = block.querySelector(".register__password-eye");

  if (!input || !eyeIcon) return;
  eyeIcon.addEventListener("click", () => {
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    eyeIcon.src = isPassword
      ? "/img/passVisibility/passEye.svg"
      : "/img/passVisibility/passEyeClose.svg";
  });
});

registerFormEnter?.addEventListener("submit", (e) => {
  e.preventDefault();

  enterUsernameInput.setCustomValidity("");
  enterPasswordInput.setCustomValidity("");

  const requiredInputs = [...registerFormEnter.elements].filter(
    (e) => e.required,
  );

  let firstInvalidInput = null;

  requiredInputs.forEach((input) => {
    const isValid = formsValidation.validateInput(input);
    if (!isValid && !firstInvalidInput) {
      firstInvalidInput = input;
    }
  });

  if (!registerFormEnter.checkValidity()) {
    if (firstInvalidInput) firstInvalidInput.focus();
    return;
  }

  const username = enterUsernameInput.value.trim();
  const password = enterPasswordInput.value.trim();

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.username === username);

  if (!user) {
    enterUsernameInput.setCustomValidity("User not found");
    formsValidation.validateInput(enterUsernameInput);
    enterUsernameInput.focus();
    return;
  }

  if (user.password !== password) {
    enterPasswordInput.setCustomValidity("Wrong password");
    formsValidation.validateInput(enterPasswordInput);
    enterPasswordInput.focus();
    return;
  }

  setAuth(username, rememberMeCheckbox.checked);
  applyAuthUI();

  closeRegister();
  formsValidation.clearForm(registerFormEnter);
});

logoutBtn?.addEventListener("click", () => {
  clearAuth();
  applyAuthUI();
  closePersonMenu();
});

registerFormRegister?.addEventListener("submit", (e) => {
  e.preventDefault();

  registerUsernameInput.setCustomValidity("");

  const usernameRegister = registerUsernameInput.value.trim();

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const isUserExist = users.some((user) => user.username === usernameRegister);

  if (isUserExist) {
    registerUsernameInput.setCustomValidity("This username is already taken");
  }

  const requiredInputs = [...registerFormRegister.elements].filter(
    (el) => el.required,
  );

  let firstInvalidInput = null;

  requiredInputs.forEach((input) => {
    const isValid = formsValidation.validateInput(input);
    if (!isValid && !firstInvalidInput) {
      firstInvalidInput = input;
    }
  });

  const isFormValid = registerFormRegister.checkValidity();

  if (!isFormValid) {
    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }
    return;
  }

  if (!isLocalStorageAvailable()) {
    if (!storageWarned) {
      alert("LocalStorage is not available in this browser mode.");
      storageWarned = true;
    }
    return;
  }

  registerLocalStorage();
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

const historyList = document.querySelector(".random__history-rows");
const streakEl = document.querySelector(".random__streak-container");
const historyEl = document.querySelector(".random__history-container");
const randomStreakBestBlock = document.querySelector(".random__streak-best");
const randomStreakCount = document.querySelector(".random__streak-count");
const randomStreakBestValue = document.querySelector(
  ".random__streak-best-value",
);

const randomPlayerOne = document.querySelector(".random__player1-name");
const randomPlayerTwo = document.querySelector(".random__player2-name");


// ===== FORMS VALIDATION CLASS =====

class FormsValidation {
  selectors = {
    form: "[data-js-form]",
    inputErrors: "[data-js-form-input-errors]",
  };

  errorMessages = {
    valueMissing: () => "This field is required",
    patternMismatch: ({ title }) =>
      title || "The data does not match the format",
    tooShort: ({ minLength }) =>
      `Value is too short, minimum characters - ${minLength}`,
    tooLong: ({ maxLength }) =>
      `Value is too long, maximum characters - ${maxLength}`,
    customError: (input) => input.validationMessage || "Invalid value",
  };

  clearForm(formElement) {
    if (!formElement) return;

    formElement.reset();

    const errorBlocks = formElement.querySelectorAll(
      this.selectors.inputErrors,
    );
    errorBlocks.forEach((block) => {
      block.innerHTML = "";
    });

    const inputs = formElement.querySelectorAll(".register__form-input");
    inputs.forEach((input) => {
      input.ariaInvalid = false;
      input.setCustomValidity("");
      input.classList.remove("error-input-color");
    });
  }

  constructor() {
    this.bindEvents();
  }

  manageErrors(inputControlElement, errorMessages) {
    const errorId = inputControlElement.getAttribute("aria-errormessage");
    const registerFormInputBlock = document.getElementById(errorId);

    if (!registerFormInputBlock) return;

    registerFormInputBlock.innerHTML = errorMessages
      .map((message) => `<span class="register__error">${message}</span>`)
      .join("");
  }

  validateInput(inputControlElement) {
    if (inputControlElement.name === "register-confirm-password") {
      const form = inputControlElement.form;
      const passwordInput = form.querySelector(
        'input[name="register-password"]',
      );

      if (passwordInput && passwordInput.value && inputControlElement.value) {
        if (passwordInput.value !== inputControlElement.value) {
          inputControlElement.setCustomValidity("Passwords do not match");
        } else {
          inputControlElement.setCustomValidity("");
        }
      } else {
        inputControlElement.setCustomValidity("");
      }
    }

    const errors = inputControlElement.validity;
    const errorMessages = [];

    for (const [errorType, getErrorMessage] of Object.entries(
      this.errorMessages,
    )) {
      if (errors[errorType]) {
        errorMessages.push(getErrorMessage(inputControlElement));
        break;
      }
    }

    this.manageErrors(inputControlElement, errorMessages);

    const isValid = errorMessages.length === 0;
    inputControlElement.ariaInvalid = !isValid;

    if (isValid) {
      inputControlElement.classList.remove("error-input-color");
    } else {
      inputControlElement.classList.add("error-input-color");
    }

    return isValid;
  }

  onBlur(e) {
    const { target } = e;

    const isFormInput = target.closest(this.selectors.form);
    const isRequired = target.required;

    if (isFormInput && isRequired) {
      this.validateInput(target);
    }
  }

  onChange(e) {
    const { target } = e;
    const isRequired = target.required;
    const isToggleType = ["radio", "checkbox"].includes(target.type);

    if (isToggleType && isRequired) {
      this.validateInput(target);
    }
  }

  bindEvents() {
    document.addEventListener("focusout", (e) => {
      if (!e.target.classList.contains("register__form-input")) return;
      this.onBlur(e);
    });

    document.addEventListener("focusin", (e) => {
      const target = e.target;

      if (!e.target.classList.contains("register__form-input")) return;

      this.manageErrors(e.target, []);
      e.target.ariaInvalid = false;
      target.classList.remove("error-input-color");
    });

    document.addEventListener("change", (e) => this.onChange(e));
  }
}

const formsValidation = new FormsValidation();

// ===== AUTH + STORAGE =====

function isLocalStorageAvailable() {
  try {
    const testKey = "__test_localstorage__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

function getUsersArray() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsersArray(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setAuth(username, remember) {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);

  const payload = { username };
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_KEY, JSON.stringify(payload));
}

function getAuth() {
  return JSON.parse(
    sessionStorage.getItem(AUTH_KEY) ||
      localStorage.getItem(AUTH_KEY) ||
      "null",
  );
}

function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
}

function applyAuthUI() {
  const auth = getAuth();
  document.body.classList.toggle("logged-in", !!auth);

  const el = document.querySelector(".header__person-menu-button-account-name");
  if (!el) return;

  el.textContent = auth?.username ? auth.username : "Account";
}

function registerLocalStorage() {
  const usernameRegister = registerUsernameInput.value.trim();
  const passwordRegister = registerPasswordInput.value.trim();

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  users.push({
    username: usernameRegister,
    password: passwordRegister,
  });

  localStorage.setItem("users", JSON.stringify(users));

  setAuth(usernameRegister, rememberMeCheckbox.checked);
  applyAuthUI();
  closeRegister();
  formsValidation.clearForm(registerFormRegister);
}

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

  applyAuthUI();
});

function attachPlayHandler() {
  if (!randomButtonPlay) return;
  randomButtonPlay.removeEventListener("click", onPlayClick);
  randomButtonPlay.addEventListener("click", onPlayClick, { once: true });
}

// ===== ACCESSIBILITY / FOCUS =====

function initKbdNav() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Tab") body.classList.add("kbd-nav");
  });

  window.addEventListener("pointerdown", () => {
    body.classList.remove("kbd-nav");
  });
}

function initHeaderFocusFix() {
  document.addEventListener(
    "keydown",
    (e) => {
      const k = e.key;
      if (typeof k !== "string") return;
      if (k === "Tab" || k.startsWith("Arrow") || k === "Enter" || k === " ") {
        keyboardMode = true;
      }
    },
    true,
  );

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType === "mouse") keyboardMode = false;
    },
    true,
  );

  if (header) {
    header.addEventListener(
      "mousedown",
      (e) => {
        if (keyboardMode) return;
        if (e.button !== 0) return;
        const btn = e.target.closest("button");
        if (btn) e.preventDefault();
      },
      true,
    );
  }

  document.addEventListener(
    "pointerup",
    (e) => {
      if (keyboardMode) return;
      if (e.pointerType !== "mouse") return;

      const active = document.activeElement;
      if (
        active &&
        header &&
        header.contains(active) &&
        active.tagName === "BUTTON"
      ) {
        active.blur();
      }
    },
    true,
  );
}

// ===== LISTENERS =====

// disable zooming

initKbdNav();
initHeaderFocusFix();

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