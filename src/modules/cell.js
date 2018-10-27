// ############################################################################
/**
 * A class to represent a cell in the grid
 * @class
 * @constructor
 */
function Cell() {
  this.value = 15; // all walls - not visited
};

// -----------------------------------------------------------------------------
/**
 * Check if there is a wall to the north.
 * @return {boolean} true if north wall is there.
*/
Cell.prototype.getWallNorth = function() {
  return (this.value & 1) == 1;
};
// -----------------------------------------------------------------------------
/**
 * Check if there is a wall to the east.
 * @return {boolean} true if east wall is there.
*/
Cell.prototype.getWallEast = function() {
  return (this.value & 2) == 2;
};
// -----------------------------------------------------------------------------
/**
 * Check if there is a wall to the south.
 * @return {boolean} true if south wall is there.
*/
Cell.prototype.getWallSouth = function() {
  return (this.value & 4) == 4;
};
// -----------------------------------------------------------------------------
/**
 * Check if there is a wall to the west.
 * @return {boolean} true if west wall is there.
*/
Cell.prototype.getWallWest = function() {
  return (this.value & 8) == 8;
};
// -----------------------------------------------------------------------------
/**
 * Check if the cell has been visited before.
 * @return {boolean} true if the cell has been visited.
*/
Cell.prototype.getVisited = function() {
  return (this.value & 16) == 16;
};
// -----------------------------------------------------------------------------
/**
 * Check if the cell has been pushed to stack.
 * @return {boolean} true if the cell is pushed on stack.
*/
Cell.prototype.getPushed = function() {
  return (this.value & 32) == 32;
};
// -----------------------------------------------------------------------------
/**
 * set the wall to the north.
 * @param {boolean} bool true if the wall should be set, false if it should be
 *   cleared
*/
Cell.prototype.setWallNorth = function(bool) {
  if (bool) {
    this.value = this.value | 1;
  } else {
    this.value = this.value & 62;
  }
};
// -----------------------------------------------------------------------------
/**
 * set the wall to the east.
 * @param {boolean} bool true if the wall should be set, false if it should be
 *   cleared
*/
Cell.prototype.setWallEast = function(bool) {
  if (bool) {
    this.value = this.value | 2;
  } else {
    this.value = this.value & 61;
  }
};
// -----------------------------------------------------------------------------
/**
 * set the wall to the south.
 * @param {boolean} bool true if the wall should be set, false if it should be
 *   cleared
*/
Cell.prototype.setWallSouth = function(bool) {
  if (bool) {
    this.value = this.value | 4;
  } else {
    this.value = this.value & 59;
  }
};
// -----------------------------------------------------------------------------
/**
 * set the wall to the west.
 * @param {boolean} bool true if the wall should be set, false if it should be
 *   cleared
*/
Cell.prototype.setWallWest = function(bool) {
  if (bool) {
    this.value = this.value | 8;
  } else {
    this.value = this.value & 55;
  }
};
// -----------------------------------------------------------------------------
/**
 * mark or unmark the cell as visited.
 * @param {boolean} bool true if the cell should be marked as visited, false if
 *   it should be marked as not visited.
*/
Cell.prototype.setVisited = function(bool) {
  if (bool) {
    this.value = this.value | 16;
  } else {
    this.value = this.value & 47;
  }
};
// -----------------------------------------------------------------------------
/**
 * mark or unmark the cell as pushed to stack.
 * @param {boolean} bool true if the cell should be marked as pushed, false if
 *   it should be marked as not visited.
*/
Cell.prototype.setPushed = function(bool) {
  if (bool) {
    this.value = this.value | 32;
  } else {
    this.value = this.value & 31;
  }
};

// ############################################################################
module.exports = {
  Cell: Cell,
};
