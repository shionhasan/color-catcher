const game = document.getElementById("game");
const catcher = document.getElementById("catcher");
const scoreDisplay = document.getElementById("score");
const toggleButton = document.getElementById("toggleButton");

let score = 0;
let lives = 3;
let highScore = localStorage.getItem("highScore") || 0; // Get saved high score
let catcherX = 180;
let isRunning = false;
let ballTimer = null;
let moveTimer = null;

const colors = ["red", "green", "blue", "yellow"];
const targetColor = "blue";

document.addEventListener("keydown", (e) => {
  if (!isRunning) return;
  if (e.key === "ArrowLeft" || e.key === "a")
    catcherX = Math.max(0, catcherX - 20);
  if (e.key === "ArrowRight" || e.key === "d")
    catcherX = Math.min(360, catcherX + 20);
  catcher.style.left = catcherX + "px";
});

function createBall() {
  const ball = document.createElement("div");
  ball.className = "ball";
  const color = colors[Math.floor(Math.random() * colors.length)];
  ball.dataset.color = color;
  ball.style.background = color;
  ball.style.color = color; // set text color so box-shadow matches
  ball.style.left = Math.floor(Math.random() * 380) + "px";
  ball.style.top = "0px";
  game.appendChild(ball);
}

function moveBalls() {
  const balls = Array.from(document.querySelectorAll(".ball"));
  balls.forEach((ball) => {
    let top = parseInt(ball.style.top);
    top += 5;
    ball.style.top = top + "px";

    const ballX = parseInt(ball.style.left);
    const ballY = top + 10;

    // Check collision with catcher
    if (ballY >= 590 && ballX + 20 >= catcherX && ballX <= catcherX + 40) {
      if (ball.dataset.color === targetColor) {
        score++;
      } else {
        lives--;
      }
      // Remove ball immediately
      ball.remove();
      updateScore();
      return; // Exit for this ball, no further checks needed
    }

    // Remove if falls below screen
    if (top > 600) {
      ball.remove();
    }
  });
}

function updateScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Save new high score
  }

  scoreDisplay.textContent = `Score: ${score} | Lives: ${lives} | High Score: ${highScore}`;

  if (lives <= 0) gameOver();
}

function gameOver() {
  stopGame();
  alert(`Game Over! Score: ${score}`);
  resetGame();
}

function resetGame() {
  score = 0;
  lives = 3;
  updateScore();
  catcherX = 180;
  catcher.style.left = catcherX + "px";
  document.querySelectorAll(".ball").forEach((b) => b.remove());
}

function startGame() {
  isRunning = true;
  ballTimer = setInterval(createBall, 1000);
  moveTimer = setInterval(moveBalls, 50);
  toggleButton.textContent = "Pause";
}

function stopGame() {
  isRunning = false;
  clearInterval(ballTimer);
  clearInterval(moveTimer);
  ballTimer = null;
  moveTimer = null;
  toggleButton.textContent = "Start";
}

toggleButton.addEventListener("click", () => {
  isRunning ? stopGame() : startGame();
});

updateScore();
