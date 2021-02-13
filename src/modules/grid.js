const cells = require('./cell.js');
const Cell = cells.Cell;

// ############################################################################
/**
 * a class to represent a grid of cells
 * @class
 * @constructor
 * @param {number} width width of the grid
 * @param {number} height height of the grid
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
      if (this.cell[c][r].getWallNorth()) {
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
  if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
    const errMsg = '(x,y) cords: (' + x + ', ' + y + ') supplied in params' +
      ' is outside the grid';
    throw new RangeError(errMsg);
  }

  const result = [];
  if (y > 0) {
    if (!this.cell[x][y - 1].getVisited()) {
      result.push('n');
    }
  }
  if (x < (this.width - 1)) {
    if (!this.cell[x + 1][y].getVisited()) {
      result.push('e');
    }
  }
  if (y < this.height - 1) {
    if (!this.cell[x][y + 1].getVisited()) {
      result.push('s');
    }
  }
  if (x > 0) {
    if (!this.cell[x - 1][y].getVisited()) {
      result.push('w');
    }
  }
  return result;
};

// ############################################################################
// export {Grid};
module.exports = {
  Grid: Grid,
};
