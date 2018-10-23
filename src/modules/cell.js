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
Cell.prototype.getPushed = function() {
  return (this.value & 32) == 32;
};
// -----------------------------------------------------------------------------
Cell.prototype.setWallNorth = function(bool) {
  if (bool) {
    this.value = this.value | 1;
  } else {
    this.value = this.value & 62;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setWallEast = function(bool) {
  if (bool) {
    this.value = this.value | 2;
  } else {
    this.value = this.value & 61;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setWallSouth = function(bool) {
  if (bool) {
    this.value = this.value | 4;
  } else {
    this.value = this.value & 59;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setWallWest = function(bool) {
  if (bool) {
    this.value = this.value | 8;
  } else {
    this.value = this.value & 55;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setVisited = function(bool) {
  if (bool) {
    this.value = this.value | 16;
  } else {
    this.value = this.value & 47;
  }
};
// -----------------------------------------------------------------------------
Cell.prototype.setPushed = function(bool) {
  if (bool) {
    this.value = this.value | 32;
  } else {
    this.value = this.value & 31;
  }
};

// export {Cell};

// ############################################################################
module.exports = {
  Cell: Cell,
};
