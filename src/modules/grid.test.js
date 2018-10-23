const expect = require('chai').expect;
const Grid = require('./grid').Grid;

describe('Class Grid tests', () => {
  it('Check that we can instantiate Grid', () => {
    let g1 = new Grid(20, 10);
    expect(true).to.equal(true);
    expect(g1).to.not.equal(undefined);
  });
});
