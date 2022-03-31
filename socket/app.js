const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app.html');
});

var players = {};
let users = []

io.on('connection', function (socket) {
    console.log(socket.id, "user connected");
    players[socket.id] = {
        playerId: socket.id,
    };
    users.push(socket.id);

    socket.emit('currentPlayers', players[socket.id]);

    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('disconnect', function () {
        console.log(socket.id, 'user disconnected');
        // socket.broadcast.emit('disconnect', socket.id)
    });
    socket.on('chat message', function (msg) {
        console.log(msg);
        socket.broadcast.emit('chat message', msg)
    });
    socket.on('upDateplayer', function(data){
        socket.broadcast.emit('upDateplayer', data,socket.id)
    })
    socket.on('upDateanimation', function(data){
        socket.broadcast.emit('upDateanimation', data)
    })
})

http.listen('3010', function () {
    console.log('on port 3010');
})