"use strict";

// ===== DOM =====

const body = document.body;

// layout

const overlay = document.querySelector(".overlay");
const header = document.querySelector(".header");
const burgerButton = document.querySelector(".header__burger-button");

//sidebar

const randomGame = document.querySelector(".sidebar__random-game");

// account

const accountMenu = document.querySelector(".person-menu-button-account");
const accountCancelButton = document.querySelector(".account__cancel-button");
const accountSaveButton = document.querySelector(".account__save-button");
const avatarBox = document.querySelector(".account__avatar-list-container");
const accountAvatarImgBlock = document.querySelector(
  ".account__avatar-img-block",
);

// home

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

// random

const randomPlayer1 = document.querySelector(".random__player1");
const randomPlayer2 = document.querySelector(".random__player2");

const randomPlayer1Count = randomPlayer1?.querySelector(
  ".random__player1-count",
);
const randomPlayer2Count = randomPlayer2?.querySelector(
  ".random__player2-count",
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

// ===== STATE / CONSTS =====

let keyboardMode = false;
let selectedAvatarId = null;

let storageWarned = false;
let userWinStreak = 0;

let selectedPlayer = 1;

let playDeadlineId = null;
let queueDelayId = null; // 100ms таймер перед активацией
let queueActiveId = null; // 15000ms таймер на снятие класса

let lastQueuePlayer = null; // кого запустил последний showQueue: 1 или 2
let forceQueuePlayer = null;

let cubeResultPlayerOne = null;
let cubeResultPlayerTwo = null;

let playLocked = false;

const AUTH_KEY = "authUser";
const BOT_NAME = "__BOT__";
const BOT_AVATAR_KEY = "botAvatarId";
const USER_AVATAR_KEY = "guestUserAvatarId";

const BOT_AVATARS = [
  "../img/black theme avatar/Robot avatar 3/BlackThRbAvatar 1.webp",
  "../img/black theme avatar/Robot avatar 3/BlackThRbAvatar 2.webp",
  "../img/black theme avatar/Robot avatar 3/BlackThRbAvatar 3.webp",
];
const USER_AVATARS = [
  "../img/black theme avatar/Player avatar 8-12/BlackThPlAvatar 1.webp",
  "../img/black theme avatar/Player avatar 8-12/BlackThPlAvatar 2.webp",
  "../img/black theme avatar/Player avatar 8-12/BlackThPlAvatar 3.webp",
  "../img/black theme avatar/Player avatar 8-12/BlackThPlAvatar 4.webp",
  "../img/black theme avatar/Player avatar 8-12/BlackThPlAvatar 5.webp",
  "../img/black theme avatar/Player avatar 8-12/BlackThPlAvatar 6.webp",
];

// ===== UI / PANELS FUNCTIONS =====

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

function setButtonsAvatarMode() {
  if (accountCancelButton) accountCancelButton.textContent = "Back";
  if (accountSaveButton) accountSaveButton.textContent = "Choose";
}

function setButtonsDefaultMode() {
  if (accountCancelButton) accountCancelButton.textContent = "Cancel";
  if (accountSaveButton) accountSaveButton.textContent = "Save";
}

function closeAccount() {
  body.classList.remove("account-active");
  body.classList.remove("change-avatar");
  setButtonsDefaultMode();
}

function closeChangeAvatar() {
  body.classList.remove("change-avatar");

  removeSelectedAvatarClass();

  setButtonsDefaultMode();
}

function handleAccountBackOrClose() {
  if (body.classList.contains("change-avatar")) {
    closeChangeAvatar();
    // body.classList.remove("change-avatar");
    return true; // обработали
  }
  if (body.classList.contains("account-active")) {
    closeAccount();
    return true;
  }
  return false;
}

function removeSelectedAvatarClass() {
  if (!avatarBox) return;

  const selectedItems = avatarBox.querySelectorAll(
    ".account__avatar-item.is-selected",
  );

  selectedItems.forEach((el) => el.classList.remove("is-selected"));
  selectedAvatarId = null;
}

// ===== AUTH + STORAGE =====

function isLocalStorageAvailable() {
  try {
    const testKey = "__test_localstorage__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true; // всё ок, можно использовать
  } catch (e) {
    return false; // нельзя – лучше не трогать
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
  const storage = remember ? localStorage : sessionStorage; // галочка = localStorage
  storage.setItem(AUTH_KEY, JSON.stringify(payload));
  loadStats();
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
  // if (el) el.textContent = auth?.username ?? "Account";

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
    // avatarId: getGuestUserAvatarId(),
    avatarId: Math.floor(Math.random() * USER_AVATARS.length),
  });

  localStorage.setItem("users", JSON.stringify(users));

  setAuth(usernameRegister, rememberMeCheckbox.checked);
  applyAuthUI();
  bestStreakVisibility();
  setStreakBestValue(getBestStreak());
  streakAndHistoryUnavailable();

  assignSeats();

  applyAccountAvatar();
  updateStreakUI();
  renderHistoryFromStorage();
  closeRegister();
  formsValidation.clearForm(registerFormRegister);
}

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

// ===== STATS / STREAK / HISTORY =====

function isBotName(name) {
  return String(name).trim() === BOT_NAME;
}

function isUserName(name) {
  const auth = getAuth();
  return !!auth && String(name).trim() === String(auth.username).trim();
}

function labelForPlayer(name) {
  if (isBotName(name)) return "Bot";
  if (isUserName(name)) return "You";
  return String(name).trim();
}

function labelForWinner(name) {
  if (name === "Friendship") return "Friendship";
  if (isBotName(name)) return "Bot";
  if (isUserName(name)) return "You";
  return String(name).trim();
}

function loadStats() {
  const auth = getAuth();
  const localStorageAvailable = isLocalStorageAvailable();

  if (localStorageAvailable && auth) {
    const username = auth.username;
    const stats = JSON.parse(localStorage.getItem("stats") || "{}");

    if (!stats[username]) {
      stats[username] = {
        bestStreak: 0,
        history: [],
      };
    }

    localStorage.setItem("stats", JSON.stringify(stats));
    setStreakBestValue(stats[username].bestStreak);
  } else if (!localStorageAvailable) {
    if (!storageWarned) {
      alert("LocalStorage is not available in this browser mode.");
      storageWarned = true;
    }
    return;
  }
}

function updateBestStreak() {
  const auth = getAuth();
  if (!auth) return;

  const username = auth.username;
  const stats = JSON.parse(localStorage.getItem("stats") || "{}");

  if (!stats[username]) {
    stats[username] = { bestStreak: 0, history: [] };
  }

  if (userWinStreak > stats[username].bestStreak) {
    stats[username].bestStreak = userWinStreak;
    localStorage.setItem("stats", JSON.stringify(stats));
  }

  setStreakBestValue(stats[username].bestStreak);
}

function updateStreakUI() {
  const auth = getAuth();
  const nameEl = document.querySelector(".random__streak-player");

  if (nameEl) nameEl.textContent = auth?.username ?? "Player";
  setStreakBestValue(getBestStreak());
}

function streakAndHistoryAddClass() {
  streakEl?.classList.add("unavailable-active");
  historyEl?.classList.add("unavailable-active");
}

function streakAndHistoryUnavailable() {
  streakEl.classList.remove("unavailable-active");
  historyEl.classList.remove("unavailable-active");

  const auth = getAuth();

  if (!auth) {
    streakAndHistoryAddClass();
  }
}

function getUserSlot() {
  const auth = getAuth();
  if (!auth) return null;

  const username = String(auth.username).trim();

  if (String(randomPlayerOne.dataset.pid).trim() === username) return 1;
  if (String(randomPlayerTwo.dataset.pid).trim() === username) return 2;

  return null;
}

function setStreakCount(count) {
  if (randomStreakCount) randomStreakCount.textContent = String(count);
}

function updateUserStreakAfterRound(winnerSlot) {
  const auth = getAuth();
  if (!auth) return;

  const userSlot = getUserSlot();
  if (!userSlot) return;

  if (winnerSlot == null) {
    userWinStreak = 0;
    setStreakCount(userWinStreak);
    return;
  }

  if (winnerSlot === userSlot) {
    userWinStreak += 1;
  } else {
    userWinStreak = 0;
  }

  setStreakCount(userWinStreak);
  updateBestStreak();
}

function getBestStreak() {
  const auth = getAuth();
  const username = auth?.username;
  if (!username) return 0;

  const stats = JSON.parse(localStorage.getItem("stats") || "{}");
  return stats[username]?.bestStreak ?? 0;
}

function setStreakBestValue(value) {
  if (randomStreakBestValue) randomStreakBestValue.textContent = String(value);
}

function bestStreakVisibility() {
  const auth = getAuth();

  if (!randomStreakBestBlock) return;
  randomStreakBestBlock.classList.toggle("streak-best-block-active", !!auth);
}

function getUserStats() {
  const auth = getAuth();
  if (!auth) return null;

  const username = auth.username;
  const stats = JSON.parse(localStorage.getItem("stats") || "{}");

  if (!stats[username]) {
    stats[username] = { bestStreak: 0, history: [] };
  }

  return { stats, username };
}

function pushHistoryToStorage({ ts, date, p1, p2, winner }) {
  const pack = getUserStats();
  if (!pack) return;

  const { stats, username } = pack;

  stats[username].history.unshift({ ts, date, p1, p2, winner });
  stats[username].history = stats[username].history.slice(0, 50);

  localStorage.setItem("stats", JSON.stringify(stats));
}

function renderHistoryFromStorage() {
  const pack = getUserStats();
  if (!pack || !historyList) return;

  const { stats, username } = pack;
  const rows = stats[username].history || [];

  historyList.textContent = "";

  for (const r of rows) {
    const matchText = `${labelForPlayer(r.p1)} × ${labelForPlayer(r.p2)}`;
    const winnerText = labelForWinner(r.winner);

    addHistoryRow(r.date, matchText, winnerText);
  }

  updateHistoryHeaderPadding();
}

function getHistoryDate() {
  const dt = new Date();

  return (
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    })
      .format(dt)
      .replace(",", "") +
    " • " +
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dt)
  );
}

function addHistoryRow(dateText, matchText, winnerText) {
  if (!historyList) return;

  const li = document.createElement("li");
  li.classList.add("random__history-row");

  const date = document.createElement("span");
  date.classList.add("random__history-date");
  date.textContent = dateText;

  const match = document.createElement("span");
  match.classList.add("random__history-match");
  match.textContent = matchText;

  const winner = document.createElement("span");
  winner.classList.add("random__history-winner");
  winner.textContent = winnerText;

  li.append(date, match, winner);
  historyList.append(li);
}

function updateHistoryHeaderPadding() {
  const rows = document.querySelector(".random__history-rows");
  const head = document.querySelector(".random__history-head");
  if (!rows || !head) return;

  const hasScroll = rows.scrollHeight > rows.clientHeight;
  const sbw = hasScroll ? rows.offsetWidth - rows.clientWidth : 0;

  head.style.setProperty("--sbw", sbw + "px");
}

// ===== AVATARS / SEATS =====

function getBotAvatarId() {
  let id = sessionStorage.getItem(BOT_AVATAR_KEY);
  if (id === null) {
    id = String(Math.floor(Math.random() * 3));
    sessionStorage.setItem(BOT_AVATAR_KEY, id);
  }
  return Number(id);
}

function getGuestUserAvatarId() {
  let id = sessionStorage.getItem(USER_AVATAR_KEY);
  if (id === null) {
    id = String(Math.floor(Math.random() * 6));
    sessionStorage.setItem(USER_AVATAR_KEY, id);
  }
  return Number(id);
}

function ensureUserAvatarSaved(username) {
  const users = getUsersArray();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;

  if (users[idx].avatarId === undefined || users[idx].avatarId === null) {
    users[idx].avatarId = Math.floor(Math.random() * USER_AVATARS.length);
    saveUsersArray(users);
  }
}

function getCurrentUserAvatarId() {
  const auth = getAuth();

  if (!auth || !auth.username) return getGuestUserAvatarId();

  const users = getUsersArray();
  const u = users.find((x) => x.username === auth.username);

  if (!u) return getGuestUserAvatarId();

  if (u.avatarId === undefined || u.avatarId === null) {
    u.avatarId = getGuestUserAvatarId();
    saveUsersArray(users);
  }

  return Number(u.avatarId);
}

function applyAvatars() {
  const leftName = randomPlayerOne.textContent.trim();
  const rightName = randomPlayerTwo.textContent.trim();

  const leftImg = document.querySelector(".random__player1-avatar img");
  const rightImg = document.querySelector(".random__player2-avatar img");
  if (!leftImg || !rightImg) return;

  const botSrc = BOT_AVATARS[getBotAvatarId()];
  const userSrc = USER_AVATARS[getCurrentUserAvatarId()];

  if (leftName === "Bot") {
    leftImg.src = botSrc;
    rightImg.src = userSrc;
  } else if (rightName === "Bot") {
    rightImg.src = botSrc;
    leftImg.src = userSrc;
  }
}

function applyAccountAvatar() {
  const img = document.querySelector(".account__avatar-img");
  if (!img) return;

  const id = getCurrentUserAvatarId();
  img.src = USER_AVATARS[id];
  img.alt = "User avatar";
}

function saveSelectedAvatarId(id) {
  const auth = getAuth();
  if (!auth) return;

  const users = getUsersArray();
  const idx = users.findIndex((u) => u.username === auth.username);
  if (idx === -1) return;

  users[idx].avatarId = id;
  saveUsersArray(users);
}

function assignSeats() {
  const auth = getAuth();
  const userName = auth?.username ?? "Player";

  selectedPlayer = Math.random() > 0.5 ? 1 : 2;

  if (selectedPlayer === 1) {
    randomPlayerOne.textContent = userName;
    randomPlayerOne.dataset.pid = userName;
  } else {
    randomPlayerOne.textContent = "Bot";
    randomPlayerOne.dataset.pid = BOT_NAME;
  }

  if (selectedPlayer === 2) {
    randomPlayerTwo.textContent = userName;
    randomPlayerTwo.dataset.pid = userName;
  } else {
    randomPlayerTwo.textContent = "Bot";
    randomPlayerTwo.dataset.pid = BOT_NAME;
  }

  applyAvatars();
}

// ===== GAME FLOW =====

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
        if (randomPlayer1Count)
          randomPlayer1Count.textContent = String(cubeNumber);
        cubeResultPlayerOne = cubeNumber;
      } else if (lastQueuePlayer === 2) {
        if (randomPlayer2Count)
          randomPlayer2Count.textContent = String(cubeNumber);
        cubeResultPlayerTwo = cubeNumber;
      }

      if (cubeResultPlayerOne !== null && cubeResultPlayerTwo !== null) {
        const leftName = String(
          randomPlayerOne.dataset.pid || randomPlayerOne.textContent,
        ).trim();
        const rightName = String(
          randomPlayerTwo.dataset.pid || randomPlayerTwo.textContent,
        ).trim();

        const dateText = getHistoryDate();

        if (cubeResultPlayerOne > cubeResultPlayerTwo) {
          updateUserStreakAfterRound(1);

          randomWinner.classList.add("show-winner");

          const winnerName = leftName;

          pushHistoryToStorage({
            ts: Date.now(),
            date: dateText,
            p1: leftName,
            p2: rightName,
            winner: winnerName,
          });

          renderHistoryFromStorage();
          randomWinnerName.textContent = labelForWinner(winnerName);

          setTimeout(() => {
            randomWinner.classList.remove("show-winner");
          }, 10000);
        } else if (cubeResultPlayerOne < cubeResultPlayerTwo) {
          updateUserStreakAfterRound(2);

          randomWinner.classList.add("show-winner");

          const winnerName = rightName;

          pushHistoryToStorage({
            ts: Date.now(),
            date: dateText,
            p1: leftName,
            p2: rightName,
            winner: winnerName,
          });

          renderHistoryFromStorage();
          randomWinnerName.textContent = labelForWinner(winnerName);

          setTimeout(() => {
            randomWinner.classList.remove("show-winner");
          }, 10000);
        } else {
          updateUserStreakAfterRound(null);

          randomWinner.classList.add("show-winner");

          const winnerName = "Friendship";

          pushHistoryToStorage({
            ts: Date.now(),
            date: dateText,
            p1: leftName,
            p2: rightName,
            winner: winnerName,
          });

          renderHistoryFromStorage();
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
        { once: true },
      );
    }, 2000);
  });
}

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

// accessibility / focus init

initKbdNav();
initHeaderFocusFix();

// sidebar

randomGame?.addEventListener("click", () => {
  closeSidebar();
  closePersonMenu();
  closeAccount();

  if (!body.classList.contains("active-random")) {
    body.classList.add("active-random");
    body.classList.remove("active-home");
  }
});

burgerButton?.addEventListener("click", () => {
  closeRegister();
  closePersonMenu();
  closeAccount();
  toggleSidebar();
});

overlay?.addEventListener("click", () => {
  if (handleAccountBackOrClose()) return;

  closeSidebar();
  closeRegister();
  closePersonMenu();

  if (!keyboardMode && document.activeElement?.blur) {
    document.activeElement.blur();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (handleAccountBackOrClose()) return;

    closeSidebar();
    closeRegister();
    closePersonMenu();
  }
});

// account

accountMenu?.addEventListener("click", () => {
  closeSidebar();
  closeRegister();
  closePersonMenu();

  applyAccountAvatar();

  setButtonsDefaultMode();

  if (!body.classList.contains("account-active")) {
    body.classList.add("account-active");
  }
});

accountCancelButton?.addEventListener("click", () => {
  handleAccountBackOrClose();
});

if (avatarBox) {
  avatarBox.addEventListener("click", (e) => {
    const item = e.target.closest(".account__avatar-item");
    if (!item) return;

    const items = [...avatarBox.querySelectorAll(".account__avatar-item")];
    const id = items.indexOf(item); // 0..5

    const already = item.classList.contains("is-selected");

    items.forEach((el) => el.classList.remove("is-selected"));

    if (already) {
      selectedAvatarId = null; // повторный клик -> снять выбор
      return;
    }

    item.classList.add("is-selected");
    selectedAvatarId = id; // ✅ сохранили выбранный id
  });
}

accountAvatarImgBlock?.addEventListener("click", () => {
  body.classList.add("change-avatar");
  setButtonsAvatarMode();
});

accountSaveButton?.addEventListener("click", () => {
  // обычный режим аккаунта -> Save закрывает
  if (!body.classList.contains("change-avatar")) {
    closeAccount();
    return;
  }

  // режим выбора авы -> Choose сохраняет
  if (selectedAvatarId == null) return;

  saveSelectedAvatarId(selectedAvatarId);
  applyAccountAvatar();
  applyAvatars();
  closeChangeAvatar();
});

// home

homeButton?.addEventListener("click", () => {
  closeSidebar();
  closeRegister();
  closePersonMenu();
  closeAccount();
  if (!body.classList.contains("active-home")) {
    body.classList.add("active-home");
    body.classList.remove("active-random");
  }
});

// DOM ready + resize

document.addEventListener("DOMContentLoaded", () => {
  body.classList.add("active-home");
  body.classList.remove("active-random");

  applyAuthUI();

  bestStreakVisibility();
  streakAndHistoryUnavailable();
  loadStats();
  renderHistoryFromStorage();
  getGuestUserAvatarId();
  assignSeats();
  updateStreakUI();
  updateHistoryHeaderPadding();
});

window.addEventListener("resize", updateHistoryHeaderPadding);

// register menu

headerPerson?.addEventListener("click", () => {
  closeSidebar();
  closeAccount();

  if (getAuth()) {
    closeSidebar();
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

// login submit

registerFormEnter?.addEventListener("submit", (e) => {
  e.preventDefault();

  // 0) Сброс кастомной ошибки (чтобы не висела со старой попытки)
  enterUsernameInput.setCustomValidity("");
  enterPasswordInput.setCustomValidity("");

  // 1) Проверка required-полей (как в регистрации)
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

  //  2) логика входа
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

  // 3) сохранить "сессию"
  setAuth(username, rememberMeCheckbox.checked);
  ensureUserAvatarSaved(username);

  applyAuthUI();
  bestStreakVisibility();
  setStreakBestValue(getBestStreak());
  streakAndHistoryUnavailable();

  assignSeats();

  applyAccountAvatar();
  updateStreakUI();
  renderHistoryFromStorage();

  // 4) закрыть окно и очистить форму
  closeRegister();
  formsValidation.clearForm(registerFormEnter);

  // тут обычно обновляют UI: показать аватар/имя, скрыть кнопку входа и т.д.
});

// logout

logoutBtn?.addEventListener("click", () => {
  clearAuth();

  applyAuthUI();
  bestStreakVisibility();
  setStreakBestValue(getBestStreak());
  streakAndHistoryUnavailable();
  assignSeats();
  updateStreakUI();
  closePersonMenu();
});

// register submit

registerFormRegister?.addEventListener("submit", (e) => {
  e.preventDefault();

  registerUsernameInput.setCustomValidity("");

  const usernameRegister = registerUsernameInput.value.trim();

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const isUserExist = users.some((user) => user.username === usernameRegister);

  if (isUserExist) {
    registerUsernameInput.setCustomValidity("This username is already taken");
  }

  // 1) Проверяем форму через валидатор

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
      firstInvalidInput.focus(); // ← фокус обратно
    }
    return;
  }

  // 2) Проверяем доступность localStorage
  if (!isLocalStorageAvailable()) {
    alert("LocalStorage is not available in this browser mode.");
    return;
  }

  // 3) Пишем в localStorage
  registerLocalStorage();
});

// game buttons

attachPlayHandler();

randomButtonStart?.addEventListener("click", () => {
  if (randomWinner.classList.contains("show-winner")) {
    randomWinner.classList.remove("show-winner");
  }

  // Подписываемся ДО запуска перехода
  const onEnd = (e) => {
    if (e.target !== randomButtonStart || e.propertyName !== "opacity") return;
    randomButtonStart.classList.add("btn-gone"); // теперь можно убрать из потока

    assignSeats();

    showPlay(); // и показать вторую кнопку
    showQueue();
  };

  randomButtonStart.addEventListener("transitionend", onEnd, { once: true });
  randomButtonStart.classList.add("btn-hidden"); // запускаем плавное исчезновение
});
