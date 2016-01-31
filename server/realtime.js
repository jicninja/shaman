var _ = require('lodash');

module.exports = function(io, numUsers) {
    var numUsers = 0;

    io.on('connection', function (socket) {
        var addedUser = false;

        // when the client emits 'new message', this listens and executes
        socket.on('change position', function (data) {
            // we tell the client to execute 'new message'
            socket.playerData = data;
            socket.broadcast.emit('change position', {
                id: socket.id,
                username: socket.username,
                data: socket.playerData,
                life: socket.life,
                shield: socket.shield
            });
        });

        socket.on('shield', function () {
            
            var me = socket;
            me.shield = true;
            setTimeout(function(){
                me.shield = false;
            }, 2000);

           socket.broadcast.emit('change position', {
                id: socket.id,
                username: socket.username,
                data: socket.playerData,
                life: socket.life,
                shield: socket.shield
            });
        });

        socket.on('fire', function (data) {
            var intervalcount = 1;
            var interval = setInterval(function(){
                var clients = io.sockets.sockets.map(function(e) {
                    return {username: e.username, id: e.id, playerData: e.playerData, life: e.life, shield: e.shield};
                });
                var users =  _.filter(clients, 'username');
                var self = _.findIndex(users, {id: socket.id});
                if(self >= 0) {
                    users.splice(self, 1);
                }
                for (var i in users) {

                  if(data.position.x > users[i].playerData.x){
                    var x = data.position.x - users[i].playerData.x;
                  }
                  else {
                    var x = users[i].playerData.x - data.position.x;
                  }
                  if(data.position.y > users[i].playerData.y){
                    var y = data.position.y - users[i].playerData.y;
                  }
                  else {
                    var y = users[i].playerData.y - data.position.y;
                  }
                  if(x <= 70 && y <= 70){                        
                     socket.broadcast.emit('die', users[i].id);
                  }  
                }
                if(data.direction == 'left'){
                    data.position.x -= 60;
                }
                else if(data.direction == 'right'){
                    data.position.x += 60;
                }
                else if(data.direction == 'up'){
                    data.position.y -= 60;
                }
                else if(data.direction == 'down'){
                    data.position.y += 60;
                }
                intervalcount++;
                if(intervalcount >= 5){
                    clearInterval(interval);
                }
            }, 100);
                        
            socket.broadcast.emit('render fire', data);
        });

        // when the client emits 'add user', this listens and executes
        socket.on('add user', function (username) {
            if (addedUser == true) {
                return false;
            }                

            // we store the username in the socket session for this client
            socket.username = username;
            socket.playerData = {x: 0, y: 0};
            socket.life = 5;
            socket.shield = false;
            ++numUsers;
            addedUser = true;
            
            var clients = io.sockets.sockets.map(function(e) {
                return {username: e.username, id: e.id, playerData: e.playerData, life: e.life, shield: e.shield};
            });

            var users =  _.filter(clients, 'username');
            var self = _.findIndex(users, {id: socket.id});

            if(self >= 0) {
                users.splice(self, 1);
            }

            socket.emit('init users', {
                id: socket.id,
                username: socket.username,
                numUsers: numUsers,
                users: users
            });

            // echo globally (all clients) that a person has connected
            socket.broadcast.emit('user joined', {
                id: socket.id,
                username: socket.username,
                numUsers: numUsers
            });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
            if (addedUser) {
                --numUsers;

                // echo globally that this client has left
                socket.broadcast.emit('user left', {
                    id: socket.id,
                    username: socket.username,
                    numUsers: numUsers
                });
            }
        });
    });

};