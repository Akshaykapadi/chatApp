const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const chatRouter = require("./route/chatRoute");
const loginRouter = require("./route/loginRoute");
const jwt = require('jsonwebtoken');

const cors = require('cors');


//require the http module
const http = require("http").Server(app)


const io = require('socket.io');


//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
  

//routes
app.use("/chats", chatRouter);
app.use('/login',loginRouter);

//set the express.static middleware
//app.use(express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);

const port = 5000;

//database connection
const Chat = require("./models/Chat");
const User = require("./models/User");


const db = require('./config/key.js').mongoURI;
console.log(db);
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected.'))
    .catch(err => console.log(err)); 

//setup event listener

socket.use(async function(io, next){
  console.log('token',io.handshake);
  if (io.handshake.query && io.handshake.query.Authorization){
    const decodedToken = jwt.verify(io.handshake.query.Authorization, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    var userDetails = await User.findOne({ _id: userId });
    console.log('length',Object.keys(userDetails).length);
    if(Object.keys(userDetails).length === 0){
      next(new Error('Authentication error'))
    }else{
      next();
    }
  } else {
    next(new Error('Authentication error'))
  }    
}).on("connection", (socket)=>{
    console.log("user connected");
    socket.on("disconnect", ()=>{
        console.log("Disconnected")
    });

     //Someone is typing
  socket.on("typing", data => {
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

   //when soemone stops typing
   socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });


  socket.on("chat message", function(messageObj) {
    console.log("message: " + messageObj.msg);

    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", { message: messageObj.msg });

    //save chat to the database
    let chatMessage = new Chat({ message: messageObj.msg, sender: messageObj.userName });
    chatMessage.save();
  });




    });




app.get('/',(req,res)=>{
    res.send('Hello world');
})


http.listen(port, () => {
    console.log("Running on Port: " + port);
});
