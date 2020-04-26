var express = require('express');
var router = express.Router();


/** Temeporary account credentials...need to add redis or db support for 
 * account verification and signup feature. Keeping it for simplicity for now.
 */
let creds = [
  {
    username:"fred",
    password:"1234"
  },
  {
    username:"george",
    password:"5678"
  },
  {
    username:"willy",
    password:"temp1234"
  }
];

const loggedInUsers = []; // To keep track of all logged in users

/** APIs for serving html files 
 * Server side rendering
*/

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

router.get('/home', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

router.post('/login', (req, res) => {
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

router.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/views/chat.html');
});

router.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

module.exports.router = router;
module.exports.loggedInUsers = loggedInUsers;


