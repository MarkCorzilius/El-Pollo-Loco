function addComputerButtonsListener() {
  handleComputerKeydownListener();
  handleComputerKeyupListener();
}

function addMobileButtonListeners() {
  handleMobileLeftListener();
  handleMobileRightListener();
  handleMobileJumpListener();
  handleMobileAttackListener();
}

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
