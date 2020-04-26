# chat-application
This repo contains real time chatting application build using socket.io and nodeJS. The frontend is build using simple HTML and JQuery

## 1. Assumption and Control Flow
1. This app is build by server side rendering and not client side rendering, so its not a SPA. 
2. It has 3 pages - Home, Chat, About - Whenever user visits any of these pages, an API call to the server brings the HTML to be rendered in browser. 
3. User needs to login to the app for establishing the socket connection to the server. Currently there are 3 accounts available to login to the app. In the future conventional signup feature will be made available. 

*{username:fred, password:1234}*

*{username:george, password:5678}*

*{username:willy, password:temp1234}*

User can signin the app using any one of the above credentials. 

### Home page 
Once loged in user will be landed on home page. As soon as he lands in home page he can see other people currently online in the side panel.  

### Chat Panel
User can chat in a group. The message send by him in chat pannel will be visible to other online users. Same is the case with other users. 

### About page
Just a temporary page - to be developed in future.

### Kindly note that even if user is in any othe above pages he can see other online users in side panel. 

## 2. Process to start application
1. Clone this repo by following command 

   git clone https://github.com/pankajm/chat-application.git

2. Go to target folder and run command 

   *npm install* 

   This will install all the dependencies. 

3. Run the app using following command. 

   *node index.js* 
   
4. Open the browser and go to following url -

   *localhost:3000
   
   This will open the signin page. Sign in with any of the above credentials say *fred.*
  
5. Once signed in open the same url through other browser or incognito mode of same browser. This time sign in with different credentials say *george* so as to maintain two different logged in user to send chat messages to each other. Go to chat pannel and send messages. 
   
#### That's it, you are all setup to play around the application.



