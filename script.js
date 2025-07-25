let mobileDevice = false;
let isLandscape = false;

/**
 * Displays the loading spinner by changing its display class.
 */
function showLoadingSpinner() {
  const spinner = document.getElementById("spinner");
  spinner.classList.replace("d-none", "d-flex");
}

/**
 * Hides the loading spinner by changing its display class.
 */
function hideLoadingSpinner() {
  const spinner = document.getElementById("spinner");
  spinner.classList.replace("d-flex", "d-none");
}

/**
 * Detects the type of device (Mobile, Tablet, or Desktop) based on the user agent and other properties.
 * @returns {string} Device type as "Mobile", "Tablet", or "Desktop".
 */
function detectDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform;
    const maxTouchPoints = navigator.maxTouchPoints || 0;
  
    if (isIPad(ua, platform, maxTouchPoints)) return "Tablet";
    if (isMobile(ua)) return "Mobile";
    if (isAndroidTablet(ua)) return "Tablet";
    return "Desktop";
  }
  
  /**
   * Detects if the device is an iPad (including iPadOS spoofing Mac).
   */
  function isIPad(ua, platform, maxTouchPoints) {
    return (
      /ipad/.test(ua) ||
      (platform === "MacIntel" && maxTouchPoints > 1) ||
      (ua.includes("macintosh") && "ontouchend" in document)
    );
  }
  
  /**
   * Detects if the device is a mobile phone.
   */
  function isMobile(ua) {
    return /iphone|android.+mobile|windows phone|mobile/i.test(ua);
  }
  
  /**
   * Detects if the device is an Android tablet.
   */
  function isAndroidTablet(ua) {
    return /android/.test(ua) && !/mobile/.test(ua);
  }



/**
 * Adjusts the UI layout and behavior for mobile or tablet devices.
 */
function adjustUIForMobileDevices() {
  if (detectDeviceType() === "Tablet" || detectDeviceType() === "Mobile") {
    mobileDevice = true;
    isLandscape = detectDeviceOrientation();
    shouldShowRotateMessage(isLandscape, detectDeviceType());
    adjustDialogSize('gameInfoDialog');
    adjustDialogSize('privacyPolicyDialog');
    adjustDialogSize('afterLevelDialog');
  }
}

/**
 * Detects if the current device orientation is landscape.
 * @returns {boolean} True if in landscape, false otherwise.
 */
function detectDeviceOrientation() {
  return window.innerWidth > window.innerHeight;
}

/**
 * Displays or hides the rotate message depending on orientation and device type.
 * @param {boolean} isLandscape - Indicates if the device is in landscape mode.
 * @param {string} deviceType - The type of device ("Mobile", "Tablet", or "Desktop").
 */
function shouldShowRotateMessage(isLandscape, deviceType) {
  if (deviceType === "Tablet") {
    handleTabletMessage(isLandscape);
  } else if (deviceType === "Mobile") {
    handleMobileMessage(isLandscape);
  } else {
    handleDesktopMessage(isLandscape);
  }
}

/**
 * Hides the "turn device" message for desktop devices.
 */
function handleDesktopMessage() {
    hideTurnDeviceMessage();
}

/**
 * Handles rotation message logic for tablet devices based on screen width and orientation.
 * @param {boolean} isLandscape - Indicates if the device is in landscape mode.
 */
function handleTabletMessage(isLandscape) {
  if (window.innerWidth >= 900) {
    hideTurnDeviceMessage();
  } else if (isLandscape && window.innerWidth < 900) {
    showTurnDeviceMessage();
  } else {
    showTurnDeviceMessage();
  }
}

/**
 * Handles rotation message logic for mobile devices based on orientation.
 * @param {boolean} isLandscape - Indicates if the device is in landscape mode.
 */
function handleMobileMessage(isLandscape) {
  if (isLandscape) {
    hideTurnDeviceMessage();
  } else {
    showTurnDeviceMessage();
  }
}

/**
 * Shows the "turn device" overlay by changing its display class.
 */
function showTurnDeviceMessage() {
  const overlay = document.getElementById("rotateOverlay");
  overlay.classList.replace("d-none", "d-flex");
}

/**
 * Hides the "turn device" overlay by changing its display class.
 */
function hideTurnDeviceMessage() {
  const overlay = document.getElementById("rotateOverlay");
  overlay.classList.replace("d-flex", "d-none");
}

/**
 * Continuously checks the device orientation at intervals and adjusts the UI accordingly.
 */
function checkDeviceOrientation() {
  setInterval(() => {
    adjustUIForMobileDevices();
  }, 100);
}

/**
 * Adjusts the game dialog size based on whether the device is mobile and in landscape orientation.
 */
function adjustDialogSize(id) {
  const dialog = document.getElementById(id);
  if (mobileDevice && isLandscape) {
    dialog.classList.replace("desktop-info-size", "mobile-info-size");

  } else {
    dialog.classList.replace("mobile-info-size", "desktop-info-size");

  }
}

/**
 * Adds a resize event listener to adjust the UI and show mobile elements when the window is resized.
 */
window.addEventListener("resize", () => {
  showMobileButtons();
  showMobileMenu();
  adjustUIForMobileDevices();
});
