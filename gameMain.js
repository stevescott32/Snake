// Author: Steven Scott
// styling constants
let borderCellColor = 'black'; // '#393E41';
let emptyCellColor = 'green'; //'#2B6845'; 
let obstacleCellColor = 'blue'; 
let snakeCellColor = 'white'; 
let appleCellColor = 'red'; 

// time constants
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

function update(timeElapsed) {
  // update all values for the game 
  //for(let i = 0; i < grid.length; i++) {
   // for(let j = 0; j < grid[i].length; j++) {
   // }; 
 // }; 
}; 

function render() {
  // render all game elements
  console.log('Rendering at time ' + timeElapsed); 
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

requestAnimationFrame(gameLoop); 
