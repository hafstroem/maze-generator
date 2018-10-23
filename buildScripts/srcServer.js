const express = require('express');
const path = require('path');
const open = require('open');

const port = 3000;
const app = express();

console.log('dirname: ' + __dirname);

app.use(express.static(path.join(__dirname, '../src' )));

app.get('/', function(req, res) {
  let filename = path.join(__dirname, '../src/index.html');
  console.log('filename: ' + filename);
  res.sendFile(filename);
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
