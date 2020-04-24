var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  console.log('ala'); 
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/home', (req, res) => {
  console.log('ala'); 
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/login', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/views/chat.html');
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id);
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message',msg);
  });

});

http.listen(3000, () => {
  console.log('listening on port:3000');
});