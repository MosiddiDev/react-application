
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5001));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/mosi-react', function(req, res) {
  res.sendfile('./public/index.html');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
