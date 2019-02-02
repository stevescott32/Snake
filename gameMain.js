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
let quit = false; 

// grid constants
let rows = 50; 
let cols = 50; 

// grid
let grid = [];  

// cell magic numbers
let border = 0;
let apple = 1;
let obstacle = 2;
let snake = 3; 
let empty = 4; 

let snakeDirection=''; 
let snakeHead = {x: 0, y: 0}; 
let snakeTail = {x: 0, y: 0}; 

function initGrid() {
  let obstaclesCreated = 0;
  let totalObstacles = 15; 
  let headCreated = false; 
  let firstApplePlaced = false; 
  for(let i = 0; i < rows; i++) {
    grid.push([]); 
    for(let j = 0; j < cols; j++) {
      if(i==0 || j==0 || i==rows-1 || j==cols-1){
        grid[i][j] = 0; 
      }
      else {
        grid[i][j] = 4; 
      }
    }; 
  };

  while(!headCreated || !firstApplePlaced) {
    let randX = Math.floor((Math.random() * rows));
    let randY = Math.floor((Math.random() * cols)); 
    if(grid[randX][randY] == empty && !headCreated) {
      grid[randX][randY] = 3; 
      snakeHead.x = randX; 
      snakeHead.y = randY;
      snakeTail.x = randX;
      snakeTail.y = randY; 
      headCreated = true; 
    }
    else if(grid[randX][randY] == empty && !firstApplePlaced)
    {
      grid[randX][randY] = 1; 
      firstApplePlaced = true; 
    }
  }
  while(obstaclesCreated < totalObstacles) {
    let randX = Math.floor((Math.random() * rows));
    let randY = Math.floor((Math.random() * cols)); 
    if(grid[randX][randY] == empty) {
      grid[randX][randY] = 2; 
      obstaclesCreated++; 
    }
  }
}; 

function button() {
}; 


function onKeyDown(e) {
        if (e.keyCode === KeyEvent.DOM_VK_A) {
          console.log('Should move left'); 
          snakeDirection = 'l'; 
        }
        else if (e.keyCode === KeyEvent.DOM_VK_D) {
          console.log('Should move right'); 
          snakeDirection = 'r'; 
        } 
        else if (e.keyCode === KeyEvent.DOM_VK_W) {
          console.log('Should move up'); 
          snakeDirection = 'u'; 
        } 
        else if (e.keyCode === KeyEvent.DOM_VK_S) {
          console.log('Should move down'); 
          snakeDirection = 'd'; 
        }
};


function update(timeElapsed) {
  let moved = true; 
  if(snakeDirection == '') {
    console.log('move the snake please'); 
    moved = false; 
  }
  else if(snakeDirection == 'u') {
    snakeHead.y--; 
  }
  else if(snakeDirection == 'd') {
    snakeHead.y++;
  }
  else if(snakeDirection == 'r') {
    snakeHead.x++; 
  }
  else if(snakeDirection == 'l') {
    snakeHead.x--; 
  }
  if(moved && grid[snakeHead.x][snakeHead.y] != empty) {
    console.log('You dead'); 
    quit = true; 
  }
  else if(moved){
   grid[snakeHead.x][snakeHead.y] = 3;  
  }
}; 

function render() {
  // render all game elements
  let canvas = document.getElementById('canvas'); 
  let context = canvas.getContext('2d'); 
//  context.strokeStyle = "blue"; 
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      if(grid[i][j] == border){
        context.fillStyle = borderCellColor; 
      }
      else if(grid[i][j] == obstacle) {
        context.fillStyle = obstacleCellColor; 
      }
      else if(grid[i][j] == snake) {
        context.fillStyle = snakeCellColor; 
      }
      else if(grid[i][j] == apple) {
        context.fillStyle = appleCellColor; 
      } 
      else {
        context.fillStyle = emptyCellColor;  
      }
      context.fillRect(10 * i, 10 * j, 10, 10); 
    }; 
  };
}; 

function gameLoop(){
  update(timeElapsed); 
  render(); 
  past = current; 
  current = performance.now(); 
  timeElapsed = current - past; 
  
  if(!quit) {
    requestAnimationFrame(gameLoop); 
  }; 
}; 

initGrid(); 
window.addEventListener('keydown', onKeyDown);
requestAnimationFrame(gameLoop); 
