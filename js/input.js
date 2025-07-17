/**
 * Initializes all keyboard event listeners for desktop gameplay.
 */
function addComputerButtonsListener() {
  handleComputerKeydownListener();
  handleComputerKeyupListener();
}

/**
 * Initializes all mobile touch event listeners for gameplay controls.
 */
function addMobileButtonListeners() {
  handleMobileLeftListener();
  handleMobileRightListener();
  handleMobileJumpListener();
  handleMobileAttackListener();
}

/**
 * Handles touch events for the left movement button on mobile.
 * Sets `keyboard.LEFT` to true or false on touchstart/touchend.
 */
function handleMobileLeftListener() {
  const leftBtn = document.getElementById("mobileBtnLeft");
  leftBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    keyboard.LEFT = true;
  });

  leftBtn.addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.LEFT = false;
  });
}

/**
 * Handles touch events for the right movement button on mobile.
 * Sets `keyboard.RIGHT` to true or false on touchstart/touchend.
 */
function handleMobileRightListener() {
  const rightBtn = document.getElementById("mobileBtnRight");
  rightBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    keyboard.RIGHT = true;
  });

  rightBtn.addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.RIGHT = false;
  });
}

/**
 * Handles touch events for the jump button on mobile.
 * Sets `keyboard.SPACE` to true or false on touchstart/touchend.
 */
function handleMobileJumpListener() {
  const jumpBtn = document.getElementById("mobileBtnJump");
  jumpBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    keyboard.SPACE = true;
  });

  jumpBtn.addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.SPACE = false;
  });
}

/**
 * Handles touch events for the attack button on mobile.
 * Sets `keyboard.D` to true or false on touchstart/touchend.
 */
function handleMobileAttackListener() {
  const attackBtn = document.getElementById("mobileBtnAttack");
  attackBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    keyboard.D = true;
  });

  attackBtn.addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.D = false;
  });
}

/**
 * Listens for keyup events on the keyboard and updates the `keyboard` object.
 * Resets movement and action keys to false.
 */
function handleComputerKeyupListener() {
  window.addEventListener("keyup", (event) => {
    if (!keyboard) return;
    switch (event.key) {
      case "ArrowLeft":
        keyboard.LEFT = false;
        break;
      case "ArrowRight":
        keyboard.RIGHT = false;
        break;
      case " ":
        keyboard.SPACE = false;
        break;
      case "d":
        keyboard.D = false;
        break;
    }
  });
}

/**
 * Listens for keydown events on the keyboard and updates the `keyboard` object.
 * Activates movement and action keys.
 */
function handleComputerKeydownListener() {
  window.addEventListener("keydown", (event) => {
    if (!keyboard) return;
    switch (event.key) {
      case "ArrowLeft":
        keyboard.LEFT = true;
        break;
      case "ArrowRight":
        keyboard.RIGHT = true;
        break;
      case " ":
        keyboard.SPACE = true;
        break;
      case "d":
        keyboard.D = true;
        break;
    }
  });
}
