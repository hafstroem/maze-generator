// import path from 'path'
const path = require('path');

module.exports = {
  mode: 'development',
  entry: ['./src/modules/maze.js'],
  output: {
    path: path.resolve(__dirname, 'src/modules'),
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'EntryPoint',
  },
};

