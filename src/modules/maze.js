'use strict';
import {Grid} from './grid.js';

console.log('Starting up Maze');

let images = [];
let cellSize = 10;
let wallSize = 1;
let columns = 100;
let rows = 60;
let myGrid = new Grid(columns, rows);
let nextX = 0;
let nextY = 0;
let stack = [];
let timerId = 0;
let mazeDone = false;

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
 *  bit 6 - cell is pushed on stack
 * So value of 21 means a cell with north and south walls set and is visited.
 * Read up on binary numbers if you find this confusing
 * @return {object} imgageData
 */
function buildImgCell(cellSize, wallSize, type) {
  // find background color based on visited or not - default to white
  let backRed = 190;
  let backGreen = 190;
  let backBlue = 255;
  if ((type & 16) == 16) { // if the cell is visited, use white as background
    backRed = 255;
    backGreen = 255;
    backBlue = 255;
  }
  if ((type & 32) == 32) { // if the cell is pushed on stack use red
    backRed = 255;
    backGreen = 190;
    backBlue = 190;
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
  for (let i=0; i<64; i++) {
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
  if (!mazeDone) {
    moveTo(nextX, nextY);
  } else {
    stopTimer();
  }
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
    drawCell(x, y); // redraw now that it is marked as visited
    // handle dead end - pop from stack.
    if (stack.length > 0) {
      let returnCell = stack.pop();
      nextX = returnCell.x;
      nextY = returnCell.y;
      myGrid.cell[nextX][nextY].setPushed(false);
    } else {
      mazeDone = true;
    }
  } else {
    let direction = '';
    if (paths.length == 1) {
      direction = paths[0];
    } else {
      // there must be more than one direction possible
      myGrid.cell[x][y].setPushed(true);
      stack.push({'x': x, 'y': y});
      drawCell(x, y);
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
  document.getElementById('btnStart').disabled = true;
  document.getElementById('btnStop').disabled = false;
}
// ----------------------------------------------------------------------------
/**
 *
*/
function stopTimer() { // eslint-disable-line no-unused-vars
  console.log('Stopping Timer');
  window.clearInterval(timerId);
  if (!mazeDone) {
    document.getElementById('btnStart').disabled = false;
  }
  document.getElementById('btnStop').disabled = true;
}
// ----------------------------------------------------------------------------

export {onBodyLoad, startTimer, stopTimer, evolve};
