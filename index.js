var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');


app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

let userList = [];

let userNames = [];
let socketConnections = [];
let loggedInUsers = [];

let creds = [
  {
    username:"timon",
    password:"1234"
  },
  {
    username:"pumba",
    password:"1234"
  },
  {
    username:"simba",
    password:"786"
  }
];

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/home', (req, res) => {
  console.log('home madhe ala')
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/login', (req, res) => {
    if(loggedInUsers.includes(req.body.username))
      return res.status(500).send('user already logged in from different device/tab');
    let userFound = creds.find((user) => (user.username === req.body.username) && (user.password === req.body.password));
    if(userFound){
      loggedInUsers.push(req.body.username)
      return res.status(200).send('success');
    }
    else  
      return res.status(500).send("User not registered");
})

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/views/chat.html');
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

io.on('connection', (socket) => {
  
  socket.on('disconnect', () => { // Disconnect pe kam baki hai, remove user if tab disconnected
    let user = userList.find(user => user.socketId === socket.id && user.page !== 'login');
    if(user){
      user.socketId = null;
      user.page = null;
      setTimeout(() => {
        if(!user.socketId){
          io.emit('user disconnected', user.username);
          userNames.splice(userNames.indexOf(user.username), 1);
          loggedInUsers.splice(loggedInUsers.indexOf(user.username), 1);
          userList.splice(userList.indexOf(user), 1);
        }
      }, 1000)
    }
  });

  socket.on('user online', (onlineUser) => {
    let obj = {};
    obj.username = onlineUser;
    obj.socketId = socket.id;
    obj.page = 'login';
    userList.push(obj);

    userNames.push(onlineUser);
    socket.broadcast.emit('new user online', onlineUser);
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message',msg);
  });

  socket.on('page loads', (username, page) => {
    let user = userList.find(obj => obj.username === username);
    user.socketId = socket.id;
    user.page = page;
    socket.emit('show all online users', userNames);
  })

});

http.listen(3000, () => {
  console.log('listening on port:3000');
});