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

io.on('connection', function(socket){
    console.log(socket.id, "user connected");
    socket.on('disconnect', function(){
        console.log(socket.id, 'user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log(msg);
        socket.broadcast.emit('chat message', msg)
    })
})

http.listen('3010', function(){
    console.log('on port 3010');
})