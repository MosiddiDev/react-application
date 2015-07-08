
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', (process.env.PORT || 5001));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile('./public/index.html');
});

// Expose Service
app.get('/service', function(req, res) {
  // res.redirect('http://localhost:5000/studentService/');
  res.redirect('http://mosi-service.herokuapp.com/studentService/')
});
app.post('/service', function(req, res) {
  // var url = 'http://localhost:5000/studentService/';
  	var url = 'http://mosi-service.herokuapp.com/studentService/'
    request.post({ url: url, json: true, body: req.body, method: 'POST' }, function(err, remoteResponse, remoteBody) {
        if (err) { return console.log(err); res.status(500).end('Error'); }
    });
});
app.post('/service/:id', function(req, res) {
  // var url = 'http://localhost:5000/studentService/'+req.params.id;
    var url = 'http://mosi-service.herokuapp.com/studentService/'+req.params.id;
  	request.post({ url: url, json: true, body: req.body, method: 'POST' }, function(err, remoteResponse, remoteBody) {
        if (err) { return console.log(err); res.status(500).end('Error'); }
    });
});
app.delete('/service/:id', function(req, res) {
  // res.redirect('http://localhost:5000/studentService/'+request.params.id);
  res.redirect('http://mosi-service.herokuapp.com/studentService/'+req.params.id)
});



app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
