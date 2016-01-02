module.exports = function(io, numUsers) {
    var numUsers = 0;


    io.on('connection', function (socket) {
        var addedUser = false;

        // when the client emits 'new message', this listens and executes
        socket.on('change position', function (data) {
            // we tell the client to execute 'new message'
            socket.broadcast.emit('change position', {
                id: socket.id,
                username: socket.username,
                position: data,
            });

            console.log(io);
        });

        // when the client emits 'add user', this listens and executes
        socket.on('add user', function (username) {
            if (addedUser) return;

            // we store the username in the socket session for this client
            socket.username = username;
            ++numUsers;
            addedUser = true;

            socket.emit('login', {
                numUsers: numUsers
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