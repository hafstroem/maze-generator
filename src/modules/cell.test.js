const expect = require('chai').expect;
const Cell = require('./cell').Cell;

// import {expect} from 'chai';
// import {Cell} from './cell.js';

/*
  bit value  Meaning
   1    1    Wall North
   2    2    Wall East
   3    4    Wall South
   4    8    Wall West
   5   16    Visited already
   6   32    Pushed on Stack
*/

describe('Class Cell tests', () => {
  it('provide value 1 to cell and check that only wall north is set', () => {
    const c = new Cell();
    c.value = 1;
    expect(c.getWallNorth()).to.equal(true);
    expect(c.getWallEast()).to.equal(false);
    expect(c.getWallSouth()).to.equal(false);
    expect(c.getWallWest()).to.equal(false);
    expect(c.getVisited()).to.equal(false);
    expect(c.getPushed()).to.equal(false);
  });
  it('provide value 58 to cell and check that all get-functions ' +
      'return as expected', () => {
    const c = new Cell();
    c.value = 58;
    expect(c.getWallNorth()).to.equal(false);
    expect(c.getWallEast()).to.equal(true);
    expect(c.getWallSouth()).to.equal(false);
    expect(c.getWallWest()).to.equal(true);
    expect(c.getVisited()).to.equal(true);
    expect(c.getPushed()).to.equal(true);
  });
  it('Create new cell. Check value is 15 and that all get-functions ' +
      'return as expected', () => {
    const c = new Cell();
    expect(c.value).to.equal(15);
    expect(c.getWallNorth()).to.equal(true);
    expect(c.getWallEast()).to.equal(true);
    expect(c.getWallSouth()).to.equal(true);
    expect(c.getWallWest()).to.equal(true);
    expect(c.getVisited()).to.equal(false);
    expect(c.getPushed()).to.equal(false);
  });
});
