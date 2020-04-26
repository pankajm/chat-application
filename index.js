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
    console.log(userFound);
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
  console.log('a user connected');
  console.log(socket.id);
  
  
  socket.on('disconnect', () => { // Disconnect pe kam baki hai, remove user if tab disconnected
    let user = userList.find(user => user.socketId === socket.id && user.page !== 'login');
    console.log('user disconnected outer');
    if(user){
      console.log('user disconnected');
      console.log(userList);
      user.socketId = null;
      user.page = null;
      setTimeout(() => {
        if(!user.socketId){
          io.emit('user disconnected', user.username);
          userNames.splice(userNames.indexOf(user.username), 1);
          loggedInUsers.splice(loggedInUsers.indexOf(user.username), 1);
          userList.splice(userList.indexOf(user), 1);
          console.log('user disconnect event fired');
        }
        console.log('settimeout called');
      }, 100)
    }
  });

  socket.on('user online', (onlineUser) => {
    console.log(onlineUser + " is online");
    let obj = {};
    obj.username = onlineUser;
    obj.socketId = socket.id;
    obj.page = 'login';
    userList.push(obj);

    userNames.push(onlineUser);
    socket.broadcast.emit('new user online', onlineUser);
    console.log(userList);
  })

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message',msg);
  });

  socket.on('page loads', (username, page) => {
    console.log(username, page);
    let user = userList.find(obj => obj.username === username);
    user.socketId = socket.id;
    user.page = page;
    console.log('page loads');
    console.log(userList);
    socket.emit('show all online users', userNames);
  })

});

http.listen(3000, () => {
  console.log('listening on port:3000');
});