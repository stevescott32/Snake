// Author: Steven Scott

// ****************
// *** Settings ***
// ***************

// styling constants
let borderCellColor = 'black'; 
let emptyCellColor = 'green';  
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
let highScoresInitialized = false;

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
let snakeHead = { x: 0, y: 0 };
let snakeLength = 1;

// initialize the game 
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

  getHighScores();
  displayHighScores();
};

// ************************************************
// ************* Object Placement *****************
// ************************************************

// put a border around the board and create the background
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

// put the snake on the board - not on the border or on anything else
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

// put a new apple on the board - not on anything else
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

// place all obstacles on the game board
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

// ************************************************
// ****************** Scoring *********************
// ************************************************

// print the current score out to the screen 
function displayCurrentScore(time) {
  let scoreParent = document.getElementById('current-game-stats'); 

  while(scoreParent && scoreParent.firstChild) {
    scoreParent.removeChild(scoreParent.firstChild); 
  }

  let scoreText = 'Current Length: ' + snakeLength + ' --> Time: ' + Math.round(time / 1000) + ' seconds'; 
  let scoreChild = document.createElement('P'); 
  let scoreTextNode = document.createTextNode(scoreText); 

  scoreChild.appendChild(scoreTextNode); 
  scoreParent.appendChild(scoreChild); 
}

// print the high score list
function displayHighScores() {
  console.log('printing the high scores');
  let highScoresList = document.getElementById('highScoresList');
  if (highScoresList) {
    while (highScoresList.firstChild) {
      highScoresList.removeChild(highScoresList.firstChild);
    }
    if (highScores) {
      for (let i = 0; i < highScores.length; i++) {
        let newHighScore = document.createElement('p');
        let newHighScoreText = document.createTextNode('Snake Length: ' +
          highScores[i].snakeLength + ' --> Time: ' + Math.round(highScores[i].time / 1000) + ' seconds');
        newHighScore.appendChild(newHighScoreText);
        highScoresList.appendChild(newHighScore);
      }
    }
    highScoresInitialized = true;
  }
}

// remove the high score notification after a new game has started
function removeHighScoreNotification() {
  let notifyParent = document.getElementById('notify-of-high-score'); 

  while(notifyParent && notifyParent.firstChild) {
    notifyParent.removeChild(notifyParent.firstChild); 
  }
}

// let the user know what their high score was and celebrate their achievement 
function notifyOfNewHighScore(snakeLength, time) {
  let notifyParent = document.getElementById('notify-of-high-score'); 

  let text = 'You just created a new high score!!!'; 
  let stats = 'Snake Length: ' + snakeLength + ' --> Time: ' + Math.round(time / 1000) + ' seconds'; 
  let textChild = document.createElement('P'); 
  let statsChild = document.createElement('P'); 
  let notificationText = document.createTextNode(text); 
  let statsText = document.createTextNode(stats); 

  textChild.appendChild(notificationText); 
  statsChild.appendChild(statsText); 
  notifyParent.appendChild(textChild);
  notifyParent.appendChild(statsChild);  
}

// see if the current score makes it into the high score list
function checkForHighScores() {
  let highScoreAdded = false;
  let totalTime = endTime - startTime;
  if (!highScores || highScores.length == 0) {
    highScores.push({ snakeLength: snakeLength, time: totalTime });
    highScoreAdded = true;
  }
  else {
    let hsLength = highScores.length;
    for (let s = 0; s < hsLength; s++) {
      if (!highScoreAdded && snakeLength >= highScores[s].snakeLength) {
        highScores.splice(s, 0, { snakeLength: snakeLength, time: totalTime });
        highScoreAdded = true;
        break;
      }
    }
  }
  if (highScores.length > 5) {
    for (let tooMany = highScores.length; tooMany > 5; tooMany--) {
      highScores.pop();
    }
  }
  else if (highScores.length < 5 && !highScoreAdded) {
    highScores.push({ snakeLength: snakeLength, time: totalTime });
    highScoreAdded = true;
  }
  if(highScoreAdded){
    notifyOfNewHighScore(snakeLength, totalTime); 
  }
}

// set high scores in local storage so they persist
function storeHighScores() {
  let highScoreString = JSON.stringify(highScores);
  window.sessionStorage.setItem('highScores', highScoreString);
}

// retrieve all high scores from local storage
function getHighScores() {
  let highScoresString = window.sessionStorage.getItem('highScores');
  if (highScoresString) {
    highScores = JSON.parse(highScoresString);
  }
}

function clearHighScoresButton() {
  removeHighScoreNotification(); 
  highScores = []; 
  storeHighScores(); 
  getHighScores(); 
  displayHighScores(); 
}

// ************************************************
// ****** Game Stages and Updating ****************
// ************************************************

// quit the game 
function endGame() {
  console.log('Ending game');
  quit = true;
  endTime = performance.now();
  checkForHighScores();
  displayHighScores();
  storeHighScores();
}

// restart the game, resetting all needed values
function restartButton() {
  quit = false;
  nextDirection = '';
  currentDirection = '';
  removeHighScoreNotification(); 
  setupGame();
  requestAnimationFrame(gameLoop);
};


// check if the current direction should be updated
// and move the snakeHead based on current direction
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
  else if (currentDirection == '') {
    startTime = performance.now(); 
    return false;
  }
}

// move the snake according to the current direction
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

// update timestamp and move the snake
function update(timeElapsed) {
  accumulatedTime += timeElapsed;
  if (accumulatedTime >= snakeSpeed) {
    if(accumulatedTime > snakeSpeed * 2.5) {
      accumulatedTime = snakeSpeed * 1.5; 
    }
    moveSnake();
    if (!highScoresInitialized) {
      displayHighScores();
    }
    accumulatedTime -= snakeSpeed;
  }
};

// iterate through the graph, printing each cell 
function render() {
  let canvas = document.getElementById('canvas');
  let context = null;
  if (canvas) {
    context = canvas.getContext('2d');
  }
  if (context) {
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
        // print a border on each cell. For empty cells, border matches background color
        context.strokeRect(10 * i + 0.5, 10 * j + 0.5, 9, 9);
      };
    }
  };
  displayCurrentScore(performance.now() - startTime); 
};

// update the timestamp, update values, and render
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

// process inputs
// inputs can come from arrow keys, WASD, or hjkl(vim) 
// space, enter, or n to start new game, 
// c to clear high scores 
// esc to end game, check for high score, and start new game 
function onKeyDown(e) {
  if (e.keyCode === KeyEvent.DOM_VK_A 
    || e.keyCode === KeyEvent.DOM_VK_LEFT
    || e.keyCode === KeyEvent.DOM_VK_H) {
    nextDirection = 'l';
  }
  else if (e.keyCode === KeyEvent.DOM_VK_D 
    || e.keyCode === KeyEvent.DOM_VK_RIGHT
    || e.keyCode === KeyEvent.DOM_VK_L) {
    nextDirection = 'r';
  }
  else if (e.keyCode === KeyEvent.DOM_VK_W 
    || e.keyCode === KeyEvent.DOM_VK_UP
    || e.keyCode === KeyEvent.DOM_VK_K) {
    nextDirection = 'u';
  }
  else if (e.keyCode === KeyEvent.DOM_VK_S 
    || e.keyCode === KeyEvent.DOM_VK_DOWN
    || e.keyCode === KeyEvent.DOM_VK_J) {
    nextDirection = 'd';
  }
  else if (e.keyCode === KeyEvent.DOM_VK_SPACE
    || e.keyCode === KeyEvent.DOM_VK_ENTER
    || e.keyCode === KeyEvent.DOM_VK_RETURN
    || e.keyCode === KeyEvent.DOM_VK_N) {
    restartButton();
  }
  else if(e.keyCode === KeyEvent.DOM_VK_C) {
    clearHighScoresButton(); 
  }
  else if(e.keyCode === KeyEvent.DOM_VK_T) {
    developerCredits(); 
  }
  else if(e.keyCode === KeyEvent.DOM_VK_ESCAPE) {
    endGame(); 
    restartButton(); 
  }
};

// start off the first game by setting up the game board and calling gameLoop()
setupGame();
window.addEventListener('keydown', onKeyDown);
requestAnimationFrame(gameLoop); 

function developerCredits() {
  let message = "Development, Testing, UX: Steven Scott" 
  + "\nGame Testers: Katie Taylor, Glen Scott, Ryan Scott"; 
  alert(message);
}
