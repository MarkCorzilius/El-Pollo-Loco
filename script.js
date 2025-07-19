let mobileDevice = false;
let isLandscape = false;

function showLoadingSpinner() {
  const spinner = document.getElementById("spinner");
  spinner.classList.replace("d-none", "d-flex");
}

function hideLoadingSpinner() {
  const spinner = document.getElementById("spinner");
  spinner.classList.replace("d-flex", "d-none");
}

function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isIPad =
    /ipad/.test(ua) ||
    (platform === "MacIntel" && maxTouchPoints > 1) || // iPadOS spoofing Mac
    (ua.includes("macintosh") && "ontouchend" in document); // extra fallback

  if (isIPad) {
    return "Tablet";
  }

  const isMobile = /iphone|android.+mobile|windows phone|mobile/i.test(ua);
  if (isMobile) return "Mobile";

  const isTablet = /android/.test(ua) && !/mobile/.test(ua);
  if (isTablet) return "Tablet";

  return "Desktop";
}

function adjustUIForMobileDevices() {
  if (detectDeviceType() === "Tablet" || detectDeviceType() === "Mobile") {
    mobileDevice = true;
    isLandscape = detectDeviceOrientation();
    shouldShowRotateMessage(isLandscape);
    adjustInfoOverlayMobile();
  }
}

function detectDeviceOrientation() {
  return window.innerWidth > window.innerHeight;
}

function shouldShowRotateMessage(isLandscape) {
  if (isLandscape) {
    hideTurnDeviceMessage();
  } else {
    showTurnDeviceMessage();
  }
}

function showTurnDeviceMessage() {
  const overlay = document.getElementById("rotateOverlay");
  overlay.classList.replace("d-none", "d-flex");
}

function hideTurnDeviceMessage() {
  const overlay = document.getElementById("rotateOverlay");
  overlay.classList.replace("d-flex", "d-none");
}

function checkDeviceOrientation() {
  setInterval(() => {
    adjustUIForMobileDevices();
  }, 100);
}

function adjustInfoOverlayMobile() {
  const dialog = document.getElementById("gameInfoDialog");
  if (mobileDevice && isLandscape) {
    dialog.classList.replace("desktop-info-size", "mobile-info-size");
  } else {
    dialog.classList.replace("mobile-info-size", "desktop-info-size");
  }
}

window.addEventListener("resize", () => {
  showMobileButtons();
  showMobileMenu();
  adjustUIForMobileDevices();
});
