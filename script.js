const game = document.getElementById("game");
const catcher = document.getElementById("catcher");
const scoreDisplay = document.getElementById("score");

let score = 0;
let lives = 3;
let catcherX = 180;
const catcherSpeed = 20;
const colors = ["red", "green", "blue", "yellow"];
const targetColor = "blue"; // Color to catch

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") {
    catcherX = Math.max(0, catcherX - catcherSpeed);
  } else if (e.key === "ArrowRight" || e.key === "d") {
    catcherX = Math.min(360, catcherX + catcherSpeed);
  }
  catcher.style.left = catcherX + "px";
});

function createBall() {
  const ball = document.createElement("div");
  ball.classList.add("ball");
  const color = colors[Math.floor(Math.random() * colors.length)];
  ball.style.background = color;
  ball.dataset.color = color;
  ball.style.left = Math.floor(Math.random() * 380) + "px";
  ball.style.top = "0px";
  game.appendChild(ball);
}

function updateBalls() {
  const balls = document.querySelectorAll(".ball");
  balls.forEach((ball) => {
    const top = parseInt(ball.style.top);
    ball.style.top = top + 5 + "px";

    const ballX = parseInt(ball.style.left);
    const ballY = top + 10;
    const catcherY = 590;
    if (ballY >= catcherY && ballX + 20 >= catcherX && ballX <= catcherX + 40) {
      // Collision
      if (ball.dataset.color === targetColor) {
        score++;
      } else {
        lives--;
      }
      ball.remove();
      updateScore();
    }

    if (ballY > 600) {
      ball.remove();
    }
  });
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score} | Lives: ${lives}`;
  if (lives <= 0) {
    alert("Game Over! Final Score: " + score);
    location.reload();
  }
}

setInterval(() => {
  createBall();
}, 1000);

setInterval(() => {
  updateBalls();
}, 50);
