// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var realtime = require('./server/realtime');
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/dist'));

app.get('*', function(req, res){
  res.sendfile(__dirname + '/dist/index.html');
});
// Chatroom

var numUsers = 0;
realtime(io, numUsers);