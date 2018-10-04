'use strict';

console.log('Starting up Maze');

let images = [];

let cellSize = 10;
let wallSize = 1;
let columns = 100;
let rows = 60;

let myGrid = new Grid(columns, rows);

// let currentX = 0;
// let currentY = 0;
let nextX = 0;
let nextY = 0;

let stack = [];

let timerId = 0;

// ############################################################################
/**
 * A class to represent a cell in the grid
 * @class
 *
 * @constructor
 */
function Cell() {
  this.value = 15; // all walls - not visited
};
// -----------------------------------------------------------------------------
Cell.prototype.getWallNorth = function() {
  return (this.value & 1) == 1;
};
// -----------------------------------------------------------------------------
Cell.prototype.getWallEast = function() {
  return (this.value & 2) == 2;
};
// -----------------------------------------------------------------------------
Cell.prototype.getWallSouth = function() {
  return (this.value & 4) == 4;
};
// -----------------------------------------------------------------------------
Cell.prototype.getWallWest = function() {
  return (this.value & 8) == 8;
};
// -----------------------------------------------------------------------------
Cell.prototype.getVisited = function() {
  return (this.value & 16) == 16;
};
// -----------------------------------------------------------------------------
Cell.prototype.setWallNorth = function(bool) {
  if (bool) {
    this.value = this.value | 1;
  } else {
    this.value = this.value & 30;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setWallEast = function(bool) {
  if (bool) {
    this.value = this.value | 2;
  } else {
    this.value = this.value & 29;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setWallSouth = function(bool) {
  if (bool) {
    this.value = this.value | 4;
  } else {
    this.value = this.value & 27;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setWallWest = function(bool) {
  if (bool) {
    this.value = this.value | 8;
  } else {
    this.value = this.value & 23;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setVisited = function(bool) {
  if (bool) {
    this.value = this.value | 16;
  } else {
    this.value = this.value & 15;
  }
};
// -----------------------------------------------------------------------------

// ############################################################################
/**
 * a class to represent a grid of cells
 * @class
 * @constructor
 * @param {*} width width of the grid
 * @param {*} height height of the grid
 */
function Grid(width, height) {
  this.width = width;
  this.height = height;

  this.cell = new Array(width);
  for (let c = 0; c < width; c++) {
    this.cell[c] = new Array(height);
    for (let r = 0; r < height; r++) {
      this.cell[c][r] = new Cell();
    }
  }
};
// -----------------------------------------------------------------------------
Grid.prototype.toString = function() {
  let result = '';
  for (let r = 0; r < this.height; r++) {
    // draw north walls
    for (let c = 0; c < this.width; c++) {
      if (this.cell[c][r].wallNorth) {
        result += '+---+';
      } else {
        result += '+   +';
      }
    }
    result += '\n';
    // draw west, visited and and east
    for (let c = 0; c < this.width; c++) {
      // draw west
      if (this.cell[c][r].wallWest) {
        result += '| ';
      } else {
        result += '  ';
      }
      // draw visited
      if (this.cell[c][r].visited) {
        result += 'V';
      } else {
        result += ' ';
      }
      // draw east
      if (this.cell[c][r].wallEast) {
        result += ' |';
      } else {
        result += '  ';
      }
    }
    result += '\n';
    // draw south walls
    for (let c = 0; c < this.width; c++) {
      if (this.cell[c][r].wallSouth) {
        result += '+---+';
      } else {
        result += '+   +';
      }
    }
    result += '\n';
  }
  return result;
};

// -----------------------------------------------------------------------------
/**
 *
 * @param {number} x x-coordinate on the grid for cell to find paths for
 * @param {number} y y-coordinate on the grid for cell to find paths for
 * @return {array} array of chars 'n', 'e', 's', 'w', denoting possible paths
 * for cell.
 */
Grid.prototype.getCandidatePaths = function(x, y) {
  // Parameter validation
  if (isNaN(x) || isNaN(y)) {
    throw new Error('Parameter is not a number!');
  }
  if (x<0 || x>=this.width || y<0 || y >= this.height) {
    let errMsg = '(x,y) cords: (' + x + ', ' + y + ') supplied in params' +
      ' is outside the grid';
    throw new RangeError(errMsg);
  }

  let result = [];
  if (y > 0 ) {
    if (!this.cell[x][y-1].getVisited()) {
      result.push('n');
    }
  }
  if (x<(this.width-1)) {
    if (!this.cell[x+1][y].getVisited()) {
      result.push('e');
    }
  }
  if (y < this.height-1 ) {
    if (!this.cell[x][y+1].getVisited()) {
      result.push('s');
    }
  }
  if (x > 0) {
    if (!this.cell[x-1][y].getVisited()) {
      result.push('w');
    }
  }
  return result;
};
// ----------------------------------------------------------------------------
/**
 * Builds images to be used in the grid.
 * @param {number} cellSize size (pixels) of cell. both width and height
 * @param {number} wallSize thickness of wall in cell in pixels
 * @param {number} type denotes the type of cell to build. This is a number
 * that in binary representation describes which walls to set and if cell is
 * visited. Like this:
 *  bit 1 - north wall set
 *  bit 2 - east wall set
 *  bit 3 - south wall set
 *  bit 4 - west wall set
 *  bit 5 - cell is visited
 * So value of 21 means a cell with north and south walls set and is visited.
 * Read up on binary numbers if you find this confusing
 * @return {object} imgageData
 */
function buildImgCell(cellSize, wallSize, type) {
  // find background color based on visited or not - default to white
  let backRed = 190;
  let backGreen = 190;
  let backBlue = 255;
  if ((type & 16) == 16) {
    // if the cell is visited, use white as background
    backRed = 255;
    backGreen = 255;
    backBlue = 255;
  }
  let canvas = document.getElementById('myCanvas');
  let ctx = canvas.getContext('2d');
  let result = ctx.createImageData(cellSize, cellSize);
  // fill white
  for (let i=0; i<result.data.length; i+=4) {
    result.data[i+0]=backRed;
    result.data[i+1]=backGreen;
    result.data[i+2]=backBlue;
    result.data[i+3]=255;
  }
  let k = cellSize-wallSize; // will be used a lot below
  // do corners
  for (let i=0; i<wallSize; i++ ) {
    for (let j=0; j<wallSize; j++ ) {
      // left top corner
      result.data[(i*cellSize*4) + (j*4)]=0;
      result.data[(i*cellSize*4) + (j*4)+1]=0;
      result.data[(i*cellSize*4) + (j*4)+2]=0;
      result.data[(i*cellSize*4) + (j*4)+3]=255;
      // Right top corner
      result.data[(i*cellSize*4) + ((j+k)*4)]=0;
      result.data[(i*cellSize*4) + ((j+k)*4+1)]=0;
      result.data[(i*cellSize*4) + ((j+k)*4+2)]=0;
      result.data[(i*cellSize*4) + ((j+k)*4+3)]=255;
      // Lower left corner
      result.data[((i+k)*cellSize*4)+(j*4)]=0;
      result.data[((i+k)*cellSize*4)+(j*4)+1]=0;
      result.data[((i+k)*cellSize*4)+(j*4)+2]=0;
      result.data[((i+k)*cellSize*4)+(j*4)+3]=255;
      // Lower right corner
      result.data[((i+k)*cellSize*4)+((j+k)*4)]=0;
      result.data[((i+k)*cellSize*4)+((j+k)*4)+1]=0;
      result.data[((i+k)*cellSize*4)+((j+k)*4)+2]=0;
      result.data[((i+k)*cellSize*4)+((j+k)*4)+3]=255;
    }
  }
  if ((type & 1) == 1) { // do north wall
    for (let i=0; i<wallSize; i++ ) {
      for (let j=0; j<cellSize; j++ ) {
        result.data[(i*cellSize*4)+(j*4)]=0;
        result.data[(i*cellSize*4)+(j*4)+1]=0;
        result.data[(i*cellSize*4)+(j*4)+2]=0;
        result.data[(i*cellSize*4)+(j*4)+3]=255;
      }
    }
  }
  if ((type & 2) == 2) { // do east wall
    for (let i=0; i<cellSize; i++ ) {
      for (let j=0; j<wallSize; j++ ) {
        result.data[((i)*cellSize*4)+((j+k)*4)]=0;
        result.data[((i)*cellSize*4)+((j+k)*4)+1]=0;
        result.data[((i)*cellSize*4)+((j+k)*4)+2]=0;
        result.data[((i)*cellSize*4)+((j+k)*4)+3]=255;
      }
    }
  }
  if ((type & 4) == 4) { // do south wall
    for (let i=0; i<wallSize; i++ ) {
      for (let j=0; j<cellSize; j++ ) {
        result.data[((i+k)*cellSize*4)+(j*4)]=0;
        result.data[((i+k)*cellSize*4)+(j*4)+1]=0;
        result.data[((i+k)*cellSize*4)+(j*4)+2]=0;
        result.data[((i+k)*cellSize*4)+(j*4)+3]=255;
      }
    }
  }
  if ((type & 8) == 8) { // do west wall
    for (let i=0; i<cellSize; i++ ) {
      for (let j=0; j<wallSize; j++ ) {
        result.data[((i)*cellSize*4)+((j)*4)]=0;
        result.data[((i)*cellSize*4)+((j)*4)+1]=0;
        result.data[((i)*cellSize*4)+((j)*4)+2]=0;
        result.data[((i)*cellSize*4)+((j)*4)+3]=255;
      }
    }
  }
  return result;
}
// ----------------------------------------------------------------------------
/**
 * Build all images
 * @param {number} cellSize height and width in pixels of a cell.
 * @param {number} wallSize thickness of wall in each cell
*/
function buildAllImages(cellSize, wallSize) {
  console.log('building all images...');
  for (let i=0; i<32; i++) {
    images.push(buildImgCell(cellSize, wallSize, i));
  }
}
// ----------------------------------------------------------------------------
/**
 * Draws grid on Canvas
 */
function drawGrid() {
  let canvas = document.getElementById('myCanvas');
  let ctx = canvas.getContext('2d');
  // buildAllImages(cellSize, wallSize);
  for (let y=0; y<rows; y++) {
    for (let x=0; x<columns; x++) {
      let idx = (myGrid.cell[x][y].value & 15);
      ctx.putImageData(images[idx], 10+(x*cellSize), 10+(y*cellSize));
    }
  }
}
// ----------------------------------------------------------------------------
/**
 * @param {number} x x coordinate of cell.
 * @param {number} y y coordinate of cell
 * Draws cell on Canvas
*/
function drawCell(x, y) {
  let canvas = document.getElementById('myCanvas');
  let ctx = canvas.getContext('2d');
  // buildAllImages(cellSize, wallSize);
  let idx = (myGrid.cell[x][y].value);
  ctx.putImageData(images[idx], 10+(x*cellSize), 10+(y*cellSize));
};
// ----------------------------------------------------------------------------
// ############################################################################
/**
 * To be called when page loads.
*/
function onBodyLoad() { // eslint-disable-line no-unused-vars
  buildAllImages(cellSize, wallSize);
  drawGrid();
};
// ----------------------------------------------------------------------------
/**
 * progress crawler
*/
function evolve() { // eslint-disable-line no-unused-vars
  // console.log('evolve was pressed');
  moveTo(nextX, nextY);
}
// ----------------------------------------------------------------------------
/**
 *
 * @param {*} x x coordinate of cell
 * @param {*} y y coordinate of cell
 */
function moveTo(x, y) {
  // console.log('moving to: (' + x + ', ' + y + ')');
  // mark as visited
  myGrid.cell[x][y].setVisited(true);
  // currentX = x;
  // currentY = y;
  // console.log('get candidate paths');
  let paths = myGrid.getCandidatePaths(x, y);
  // console.log('possible paths: ' + JSON.stringify(paths));
  if (paths.length == 0) {
    // handle dead end - pop from stack.
    drawCell(x, y); // redraw now that it is marked as visited
    let returnCell = stack.pop();
    console.log('going back to: (' + returnCell.x + ', ' + returnCell.y + ')');
    nextX = returnCell.x;
    nextY = returnCell.y;
  } else {
    let direction = '';
    if (paths.length == 1) {
      direction = paths[0];
    } else {
      // there must be more than one direction possible
      stack.push({'x': x, 'y': y});
      // now choose direction.
      // console.log('Here is paths.length: ' + paths.length);
      let idx = (Math.floor(Math.random() * paths.length));
      // console.log('Here is idx: ' + idx);
      direction = paths[idx];
      // console.log('Direction chosen: ' + direction);
    }
    if (direction == 'n') {
      // console.log('going north');
      nextX = x;
      nextY = y-1;
      myGrid.cell[x][y].setWallNorth(false);
      myGrid.cell[x][y-1].setWallSouth(false);
      drawCell(x, y);
      drawCell(x, y-1);
    }
    if (direction == 'e') {
      // console.log('going east');
      nextX = x+1;
      nextY = y;
      myGrid.cell[x][y].setWallEast(false);
      myGrid.cell[x+1][y].setWallWest(false);
      drawCell(x, y);
      drawCell(x+1, y);
    }
    if (direction == 's') {
      // console.log('going south');
      nextX = x;
      nextY = y+1;
      myGrid.cell[x][y].setWallSouth(false);
      myGrid.cell[x][y+1].setWallNorth(false);
      drawCell(x, y);
      drawCell(x, y+1);
    }
    if (direction == 'w') {
      // console.log('going west');
      nextX = x-1;
      nextY = y;
      myGrid.cell[x][y].setWallWest(false);
      myGrid.cell[x-1][y].setWallEast(false);
      drawCell(x, y);
      drawCell(x-1, y);
    }
  }
}
// ----------------------------------------------------------------------------
/**
 *
*/
function startTimer() { // eslint-disable-line no-unused-vars
  console.log('Starting Timer');
  timerId = window.setInterval(function() {
    evolve();
  }, 1);
}
// ----------------------------------------------------------------------------
/**
 *
*/
function stopTimer() { // eslint-disable-line no-unused-vars
  console.log('Stopping Timer');
  window.clearInterval(timerId);
}
// ----------------------------------------------------------------------------
console.log('testarea');
console.log('logical 12 & 5: ' + (12 & 5));
console.log('logical 12 | 5: ' + (12 | 5));

let myCell = new Cell();
console.log('is north wall set? : ' + myCell.getWallNorth());
console.log('is east wall set?  : ' + myCell.getWallEast());
console.log('is south wall set? : ' + myCell.getWallSouth());
console.log('is west wall set?  : ' + myCell.getWallWest());
console.log('is cell visited?   : ' + myCell.getVisited());
// ----------------------------------------------------------------------------
