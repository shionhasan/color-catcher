const game = document.getElementById("game");
const catcher = document.getElementById("catcher");
const scoreDisplay = document.getElementById("score");
const colorOptions = document.querySelectorAll(".color-option");
const toggleButton = document.getElementById("toggleButton");

let catcherX = 180;
let score = 0;
let lives = 3;
let targetColor = "blue";

const colors = ["red", "green", "blue", "yellow"];
let highScore = localStorage.getItem("highScore") || 0;

let isRunning = false;
let ballInterval = null;
let moveInterval = null;

// Color selection
colorOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    colorOptions.forEach((o) => o.classList.remove("selected"));
    option.classList.add("selected");
    targetColor = option.dataset.color;
    resetGame();
  });
});

// Set blue as selected initially
document.querySelector('[data-color="blue"]').classList.add("selected");

// Movement
document.addEventListener("keydown", (e) => {
  if (!isRunning) return;
  if (e.key === "ArrowLeft" || e.key === "a") {
    catcherX = Math.max(0, catcherX - 20);
  } else if (e.key === "ArrowRight" || e.key === "d") {
    catcherX = Math.min(360, catcherX + 20);
  }
  catcher.style.left = catcherX + "px";
});

function createBall() {
  const ball = document.createElement("div");
  ball.className = "ball";

  const color = colors[Math.floor(Math.random() * colors.length)];
  ball.style.background = color;
  ball.style.color = color;
  ball.dataset.color = color;

  // Pick a random left position
  let left;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    left = Math.floor(Math.random() * 380); // 0 to 380
    attempts++;
    // Check overlap with existing balls
  } while (
    attempts < maxAttempts &&
    Array.from(document.querySelectorAll(".ball")).some((b) => {
      const existingLeft = parseInt(b.style.left);
      return Math.abs(existingLeft - left) < 40; // ensure 40px spacing
    })
  );

  ball.style.left = left + "px";
  ball.style.top = "0px";
  game.appendChild(ball);
}

function updateScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  scoreDisplay.textContent = `Score: ${score} | Lives: ${lives} | High Score: ${highScore}`;

  if (lives <= 0) {
    alert("Game Over! Final score: " + score);
    stopGame();
    resetGame();
  }
}

function resetGame() {
  score = 0;
  lives = 3;
  updateScore();
  catcherX = 180;
  catcher.style.left = catcherX + "px";
  document.querySelectorAll(".ball").forEach((ball) => ball.remove());
}

function moveBalls() {
  const balls = Array.from(document.querySelectorAll(".ball"));
  balls.forEach((ball) => {
    let top = parseInt(ball.style.top);
    top += 5;
    ball.style.top = top + "px";

    const ballX = parseInt(ball.style.left);
    const ballY = top + 20;

    if (ballY >= 580 && ballX + 20 >= catcherX && ballX <= catcherX + 40) {
      if (ball.dataset.color === targetColor) {
        score++;
      } else {
        lives--;
      }
      ball.remove();
      updateScore();
      return;
    }

    if (top > 600) {
      ball.remove();
    }
  });
}

function startGame() {
  if (isRunning) return;
  isRunning = true;
  toggleButton.textContent = "Pause";

  ballInterval = setInterval(() => {
    for (let i = 0; i < 2; i++) {
      createBall();
    }
  }, 1000); // 2 balls every 1 second

  moveInterval = setInterval(moveBalls, 50);
}

function stopGame() {
  isRunning = false;
  toggleButton.textContent = "Start";
  clearInterval(ballInterval);
  clearInterval(moveInterval);
}

toggleButton.addEventListener("click", () => {
  if (isRunning) {
    stopGame();
  } else {
    startGame();
  }
});

updateScore();
catcher.style.left = catcherX + "px";
