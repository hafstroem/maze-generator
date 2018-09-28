'use strict';

console.log('Starting up Maze');

/**
 * @constructor
*/
function Cell() {
  this.wallNorth = true;
  this.wallEast = true;
  this.wallSouth = true;
  this.wallWest= true;
  this.visited = false;
};

/**
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

let myGrid = new Grid(10, 5);
// open a small path
myGrid.cell[0][0].wallEast = false;
myGrid.cell[1][0].wallWest = false;

myGrid.cell[0][0].wallSouth = false;
myGrid.cell[0][1].wallNorth = false;

myGrid.cell[0][0].visited = true;
console.log('North wall of top left cell: ' + myGrid.cell[0][0].wallNorth);
console.log(myGrid.toString());
console.log('Here is a unicode char: \u2501');
