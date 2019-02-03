// Author: Steven Scott

// ****************
// *** Settings ***
// ***************

// styling constants
let borderCellColor = 'black'; // '#393E41';
let emptyCellColor = 'green'; //'#2B6845'; 
let obstacleCellColor = 'blue';
let snakeCellColor = 'white';
let appleCellColor = 'red';
let cellBorderColor = 'black'; 

// grid constants
let rows = 50;
let cols = 50;

// obstacles
let totalObstacles = 15;

// ****************
// **** State ****
// ***************

// time 
let current = performance.now();
let past = current;
let timeElapsed = current - past; //initialized to 0
let snakeSpeed = 150;
let accumulatedTime = 0;
let startTime = performance.now();
let endTime = performance.now(); 
let quit = false;

// grid
let grid = [];
let snake = [];
let highScores = []; 

// cell magic numbers
let borderCell = 0;
let appleCell = 1;
let obstacleCell = 2;
let snakeCell = 3;
let emptyCell = 4;

let currentDirection = '';
let nextDirection = ''; 
let snakeHead = {x: 0, y: 0};
let snakeLength = 1;

function setupGame() {
  grid = [];
  snake = [];
  snakeLength = 1;
  timeElapsed = 0;
  accumulatedTime = 0; 
  current = performance.now();
  past = performance.now(); 
  startTime = performance.now(); 
  snakeHead.x = 0; 
  snakeHead.y = 0; 

  createBorderAndBackground();
  placeSnakeHead();
  placeNewApple();
  placeObstacles();
};

function createBorderAndBackground() {
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      if (i == 0 || j == 0 || i == rows - 1 || j == cols - 1) {
        grid[i][j] = 0;
      }
      else {
        grid[i][j] = 4;
      }
    };
  };
}

function placeSnakeHead() {
  let headCreated = false;
  while (!headCreated) {
    let randX = Math.floor((Math.random() * rows));
    let randY = Math.floor((Math.random() * cols));
    if (grid[randX][randY] == emptyCell && !headCreated) {
      grid[randX][randY] = 3;
      snakeHead.x = randX; 
      snakeHead.y = randY; 
      snake.push({ x: randX, y: randY });
      headCreated = true;
    }
  }
}

function placeNewApple() {
  let applePlaced = false;
  while (!applePlaced) {
    let randX = Math.floor((Math.random() * rows));
    let randY = Math.floor((Math.random() * cols));
    if (grid[randX][randY] == emptyCell) {
      grid[randX][randY] = 1;
      applePlaced = true;
    }
  }
}

function placeObstacles() {
  let obstaclesCreated = 0;
  while (obstaclesCreated < totalObstacles) {
    let randX = Math.floor((Math.random() * rows));
    let randY = Math.floor((Math.random() * cols));
    if (grid[randX][randY] == emptyCell) {
      grid[randX][randY] = 2;
      obstaclesCreated++;
    }
  }
}

function displayHighScores() {
  let highScoresList = document.getElementById('highScoresList'); 
  while(highScoresList.firstChild){
    highScoresList.removeChild(highScoresList.firstChild);
  }
  for(let i = 0; i < highScores.length; i++) {
    let newHighScore = document.createElement('p'); 
    let newHighScoreText = document.createTextNode('Snake Length: ' + highScores[i].snakeLength + ' Time: ' + highScores[i].time); 
    newHighScore.appendChild(newHighScoreText); 
    highScoresList.appendChild(newHighScore); 
  }
}

function checkForHighScores() {
  let highScoreAdded = false; 
  let totalTime = endTime - startTime; 
  if(highScores.length == 0) {
    highScores.push({snakeLength: snakeLength, time: totalTime}); 
    highScoreAdded = true;
  }
  else {
    let hsLength = highScores.length; 
    for(let s = 0; s < hsLength; s++) {
      if(snakeLength >= highScores[s].snakeLength) {
        highScores.splice(s, 0, {snakeLength: snakeLength, time: totalTime}); 
        highScoreAdded = true;
        break; 
      }
    }
  }
  if(highScores.length > 5) {
    for(let tooMany = highScores.length; tooMany > 5; tooMany--) {
      highScores.pop(); 
    }
  }
  else if(highScores.length < 5 && !highScoreAdded) 
  {
    highScores.push({snakeLength: snakeLength, time: totalTime}); 
    highScoreAdded = true; 
  }
}

function endGame() {
  console.log('Ending game'); 
  quit = true; 
  endTime = performance.now(); 
  checkForHighScores(); 
  displayHighScores();
}

function restartButton() {
  quit = false;
  nextDirection = '';
  currentDirection = ''; 
  setupGame();
  requestAnimationFrame(gameLoop);
};

function updateDirection() {
  // see if current direction should be updated
  if (nextDirection == 'u' && currentDirection != 'd') {
    currentDirection = 'u'; 
  }
  else if (nextDirection == 'd' && currentDirection != 'u') {
    currentDirection = 'd'; 
  }
  else if (nextDirection == 'r' && currentDirection != 'l') {
    currentDirection = 'r';
  }
  else if (nextDirection == 'l' && currentDirection != 'r') {
    currentDirection = 'l'; 
  }
  // update the snakeHead with currentDirection
  if (currentDirection == 'u') {
    snakeHead.y--;
    return true; 
  }
  else if (currentDirection == 'd') {
    snakeHead.y++;
    return true; 
  }
  else if (currentDirection == 'r') {
    snakeHead.x++;
    return true; 
  }
  else if (currentDirection == 'l') {
    snakeHead.x--;
    return true; 
  }
  else {
    console.log('Error: no direction');
    return false; 
  }
}

function moveSnake() {
  let moved = updateDirection();
  // check if the snake has encountered an apple or other non-empty cell
  if (moved && grid[snakeHead.x][snakeHead.y] == appleCell) {
    snakeLength += 3;
    grid[snakeHead.x][snakeHead.y] = 3;
    snake.unshift({ x: snakeHead.x, y: snakeHead.y });
    placeNewApple();
  }
  else if (moved && grid[snakeHead.x][snakeHead.y] != emptyCell) {
    endGame(); 
  }
  else if (moved) {
    if (snakeLength == snake.length) {
      let last = snake[snake.length - 1];
      grid[last.x][last.y] = 4;
      snake.pop();
    }

    snake.unshift({ x: snakeHead.x, y: snakeHead.y });
    let first = snake[0];
    grid[first.x][first.y] = 3;
  }
}

function update(timeElapsed) {
  accumulatedTime += timeElapsed;
  if (accumulatedTime >= snakeSpeed) {
    moveSnake();
    accumulatedTime -= snakeSpeed;
  }
};


function render() {
  // render all game elements
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  //  context.strokeStyle = "blue"; 
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] == borderCell) {
        context.fillStyle = borderCellColor;
        context.strokeStyle = cellBorderColor;  
      }
      else if (grid[i][j] == obstacleCell) {
        context.fillStyle = obstacleCellColor;
        context.strokeStyle = cellBorderColor; 
      }
      else if (grid[i][j] == snakeCell) {
        context.fillStyle = snakeCellColor;
        context.strokeStyle = cellBorderColor;  
      }
      else if (grid[i][j] == appleCell) {
        context.fillStyle = appleCellColor;
        context.strokeStyle = cellBorderColor;  
      }
      else {
        context.fillStyle = emptyCellColor;
        context.strokeStyle = emptyCellColor;
      }
      context.fillRect(10 * i, 10 * j, 10, 10);
      context.strokeRect(10 * i + 0.5, 10 * j + 0.5, 9, 9);
    };
  };
};

function gameLoop() {
  update(timeElapsed);
  render();
  past = current;
  current = performance.now();
  timeElapsed = current - past;

  if (!quit) {
    requestAnimationFrame(gameLoop);
  };
};

function onKeyDown(e) {
  if (e.keyCode === KeyEvent.DOM_VK_A || e.keyCode === KeyEvent.DOM_VK_LEFT) {
    nextDirection = 'l';
  }
  else if (e.keyCode === KeyEvent.DOM_VK_D || e.keyCode === KeyEvent.DOM_VK_RIGHT) {
    nextDirection = 'r';
  }
  else if (e.keyCode === KeyEvent.DOM_VK_W || e.keyCode === KeyEvent.DOM_VK_UP) {
    nextDirection = 'u';
  }
  else if (e.keyCode === KeyEvent.DOM_VK_S || e.keyCode === KeyEvent.DOM_VK_DOWN) {
    nextDirection = 'd';
  }
};

setupGame();
window.addEventListener('keydown', onKeyDown);
requestAnimationFrame(gameLoop); 
