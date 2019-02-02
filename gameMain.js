// Author: Steven Scott
// styling constants
let borderCellColor = 'black'; // '#393E41';
let emptyCellColor = 'green'; //'#2B6845'; 
let obstacleCellColor = 'blue';
let snakeCellColor = 'white';
let appleCellColor = 'red';

// time 
let current = performance.now();
let past = current;
let timeElapsed = current - past; //initialized to 0
let snakeSpeed = 150; 
let accumulatedTime = 0; 
let quit = false;

// grid constants
let rows = 50;
let cols = 50;

// grid
let grid = [];
let snake = [];

// cell magic numbers
let borderCell = 0;
let appleCell = 1;
let obstacleCell = 2;
let snakeCell = 3;
let emptyCell = 4;

let snakeDirection = '';
let snakeHead = { x: 0, y: 0 };

function initGrid() {
  let obstaclesCreated = 0;
  let totalObstacles = 15;
  let headCreated = false;
  let firstApplePlaced = false;
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

  while (!headCreated || !firstApplePlaced) {
    let randX = Math.floor((Math.random() * rows));
    let randY = Math.floor((Math.random() * cols));
    if (grid[randX][randY] == emptyCell && !headCreated) {
      grid[randX][randY] = 3;
      snakeHead.x = randX;
      snakeHead.y = randY;
      snake.push({x: randX, y: randY});
      headCreated = true;
    }
    else if (grid[randX][randY] == emptyCell && !firstApplePlaced) {
      grid[randX][randY] = 1;
      firstApplePlaced = true;
    }
  }
  while (obstaclesCreated < totalObstacles) {
    let randX = Math.floor((Math.random() * rows));
    let randY = Math.floor((Math.random() * cols));
    if (grid[randX][randY] == emptyCell) {
      grid[randX][randY] = 2;
      obstaclesCreated++;
    }
  }
};

function button() {
};


function onKeyDown(e) {
  if (e.keyCode === KeyEvent.DOM_VK_A || e.keyCode === KeyEvent.DOM_VK_LEFT) {
    console.log('Should move left');
    if(snakeDirection != 'r') {
      snakeDirection = 'l';
    }
  }
  else if (e.keyCode === KeyEvent.DOM_VK_D || e.keyCode === KeyEvent.DOM_VK_RIGHT) {
    console.log('Should move right');
    if(snakeDirection != 'l') {
      snakeDirection = 'r';
    }
  }
  else if (e.keyCode === KeyEvent.DOM_VK_W || e.keyCode === KeyEvent.DOM_VK_UP) {
    console.log('Should move up');
    if(snakeDirection != 'd') {
      snakeDirection = 'u';
    }
  }
  else if (e.keyCode === KeyEvent.DOM_VK_S || e.keyCode === KeyEvent.DOM_VK_DOWN) {
    console.log('Should move down');
    if(snakeDirection != 'u') {
      snakeDirection = 'd';
    }
  }
};

function moveSnake() {
  let moved = true;
  if (snakeDirection == '') {
    moved = false;
  }
  else if (snakeDirection == 'u') {
    snakeHead.y--;
  }
  else if (snakeDirection == 'd') {
    snakeHead.y++;
  }
  else if (snakeDirection == 'r') {
    snakeHead.x++;
  }
  else if (snakeDirection == 'l') {
    snakeHead.x--;
  }
  if (moved && grid[snakeHead.x][snakeHead.y] != emptyCell) {
    console.log('You dead');
    quit = true;
  }
  else if (moved) {     
    let last = snake[snake.length - 1];
    grid[last.x][last.y] = 4;  
    snake.pop(); 

    snake.unshift({x: snakeHead.x, y: snakeHead.y}); 
    let first = snake[0]; 
    grid[first.x][first.y] = 3; 
 }
}

function update(timeElapsed) {
  accumulatedTime += timeElapsed; 
  if(accumulatedTime >= snakeSpeed) {
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
      }
      else if (grid[i][j] == obstacleCell) {
        context.fillStyle = obstacleCellColor;
      }
      else if (grid[i][j] == snakeCell) {
        context.fillStyle = snakeCellColor;
      }
      else if (grid[i][j] == appleCell) {
        context.fillStyle = appleCellColor;
      }
      else {
        context.fillStyle = emptyCellColor;
      }
      context.fillRect(10 * i, 10 * j, 10, 10);
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

initGrid();
window.addEventListener('keydown', onKeyDown);
requestAnimationFrame(gameLoop); 
