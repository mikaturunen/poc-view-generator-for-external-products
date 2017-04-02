var express = require('express');
var compression = require('compression');

var app = express();

app.use(compression());
app.use(express.static('public'));

app.listen(8000, function (err) {
  if (err) throw err;

  console.log('Generic client dev running, browse to http://localhost:8000');
});
