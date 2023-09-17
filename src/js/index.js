//Elements
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highScore");
const gameBoard = document.querySelector(".gameBoard");
const controls = document.querySelectorAll(".btn");
const btnStart = document.querySelector(".start");

//Variables
let setIntervalID;
let foodX, foodY;
let snakeX = 1,
  snakeY = 1;
let velX = 0,
  velY = 0;
let score = 0;
let snakeBody = [];

//Get High Score from localStorage on init
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

//GameOver Handler
const gameOverHandler = () => {
  clearInterval(setIntervalID);
  alert("Você perdeu! Clique no 'OK' pressione 'Enter' para reiniciar...");
  location.reload();
};

//Win Handler
const winHandler = () => {
  clearInterval(setIntervalID);
  alert("Você venceu! Clique no 'OK' pressione 'Enter' para reiniciar...");
  location.reload();
};

//Update score and high score
const updateScoreHighScore = () => {
  score++;
  scoreElement.innerHTML = `Score: ${score}`;

  highScore = score > highScore ? (highScore = score) : (highScore = highScore);
  localStorage.setItem("highScore", highScore);
  highScoreElement.innerHTML = `High Score: ${highScore}`;

  //Max points possible
  if (score >= 899) {
    winHandler();
  }
};

//Update food position (* 30 = grid max lenght [x, y])
const updateFoodPos = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;

  //Check if food is at the same place as one of the snake's part
  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY) {
      updateFoodPos();
    }
  }
};

//Set snake direction
const snakeDirection = (e) => {
  if (e.key === "ArrowUp") {
    velY = -1;
    velX = 0;
  } else if (e.key === "ArrowDown") {
    velY = 1;
    velX = 0;
  } else if (e.key === "ArrowRight") {
    velY = 0;
    velX = 1;
  } else if (e.key === "ArrowLeft") {
    velY = 0;
    velX = -1;
  }
};

//Set snake direction with keyboard
document.addEventListener("keydown", (e) => {
  snakeDirection(e);
});

//Set snake direction with buttons
controls.forEach((btn) => {
  btn.addEventListener("click", () => {
    snakeDirection({ key: btn.dataset.key });
  });
});

const snake = () => {
  //Update snake position
  snakeX += velX;
  snakeY += velY;

  //Check if snake eats food
  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPos();

    //Add foot to snakeBody
    snakeBody.push([foodY, foodX]);

    updateScoreHighScore();
  }

  //Moving snakeBody parts forward by one
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  //Snake head (snakeBody[0]) = snakePos
  snakeBody[0] = [snakeX, snakeY];

  //Check with hits the wall
  if (snakeX > 30 || snakeX < 1 || snakeY > 30 || snakeY < 1) {
    gameOverHandler();
  }
};

//Game Handler
const gameInit = () => {
  //Create food element
  let gameBoardHTML = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  //Snake configs
  snake();

  //Adding snake to HTML, for each snakeBody part
  for (let i = 0; i < snakeBody.length; i++) {
    gameBoardHTML += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

    //Check if snake hits it self, if true = gameOver
    if (
      i !== 0 &&
      snakeBody[0][1] == snakeBody[i][1] &&
      snakeBody[0][0] == snakeBody[i][0]
    ) {
      gameOverHandler();
    }
  }

  //Display HTML
  gameBoard.innerHTML = gameBoardHTML;
};


const start = () => {
  updateFoodPos();
  document.addEventListener("keyup", snakeDirection({key: 'ArrowDown'}));
  setIntervalID = setInterval(gameInit, 100);
};


btnStart.addEventListener("click", () => {
  start();
  btnStart.classList.add("hidden");
})
