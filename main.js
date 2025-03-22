// main.js
// Utility function to load a script dynamically with error handling.
function loadScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;
  script.defer = true;
  script.onload = callback;
  script.onerror = function () {
    console.error(`Failed to load script: ${url}`);
  };
  document.body.appendChild(script);
}

// Global variable to store the selected game mode. Default is "duo".
let gameMode = "duo";

// Functions to select game mode:
function selectDuoMode() {
  gameMode = "duo";
  // Show player name inputs and Player 2 controls (handled via UI)
  const nameContainer = document.getElementById("nameContainer");
  if (nameContainer) {
    nameContainer.style.display = "block";
  }
  const controls = document.getElementById("playerControls");
  if (controls && controls.children.length > 1) {
    controls.children[1].style.display = "block"; // Show Player 2 controls
  }
  // Add start button animation when a mode is selected
  animateStartButton();
}

function selectSurvivalMode() {
  gameMode = "survival";
  // Show name entry (if needed) and hide Player 2 controls
  const nameContainer = document.getElementById("nameContainer");
  if (nameContainer) {
    nameContainer.style.display = "block";
  }
  const controls = document.getElementById("playerControls");
  if (controls && controls.children.length > 1) {
    controls.children[1].style.display = "none"; // Hide Player 2 controls for solo mode
  }
  // Add start button animation when a mode is selected
  animateStartButton();
}

// Adds a pulsing animation effect to the start button.
function animateStartButton() {
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.classList.add("animate-button");
  }
}

// Start game function that loads the appropriate script based on the selected game mode.
function startGame() {
  // Animate the start button upon clicking
  animateStartButton();
  
  if (gameMode === "duo") {
    loadScript("duoMode.js", function () {
      if (typeof duoStartGame === "function") {
        duoStartGame();
      } else {
        console.error("Function duoStartGame not found.");
      }
    });
  } else if (gameMode === "survival") {
    loadScript("survival.js", function () {
      if (typeof survivalStartGame === "function") {
        survivalStartGame();
      } else {
        console.error("Function survivalStartGame not found.");
      }
    });
  } else {
    console.error("Unknown game mode: " + gameMode);
  }
}

// Expose functions globally.
window.startGame = startGame;
window.selectDuoMode = selectDuoMode;
window.selectSurvivalMode = selectSurvivalMode;
