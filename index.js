var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var {router, loggedInUsers} = require('./routes');


app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use('/', router);

let userList = [];
let userNames = [];

io.on('connection', (socket) => {
  
  socket.on('disconnect', () => { // Disconnect event is called after page refresh and tab close
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


  /** When Any user successfull singed in this event is called 
   * Other users are notified about new user so as to update the list of
   * online users
  */
  socket.on('user online', (onlineUser) => {
    let obj = {};
    obj.username = onlineUser;
    obj.socketId = socket.id;
    obj.page = 'login';
    userList.push(obj);

    userNames.push(onlineUser);
    socket.broadcast.emit('new user online', onlineUser);
  })


  /** Chat message event for broadcasting new message */
  socket.on('chat message', (msg) => {
    io.emit('chat message',msg);
  });

  /** This event will be called after page load (home, chat, about) so as to refresh
   * online users list for that page of that user only
   */
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

