const express = require("express");
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('./Config/DbConfig');
const UserRoute = require("./routes/UserRoute");
const userModel = require("./models/userModel");
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();

const allowedOrigins = [
  "https://clientv2-omega.vercel.app/",
  "http://localhost:5173",
  "https://clientv2-git-main-rajeevchaudhary-xs-projects.vercel.app/",
  "https://clientv2-8mcrikbpm-rajeevchaudhary-xs-projects.vercel.app/"
]



// CORS and BodyParser setup
const corsOptions = {
  origin: allowedOrigins, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
  optionsSuccessStatus: 200 
};


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create server with CORS configuration
const server = require('http').createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Your client URL
        methods: ['GET', 'POST'], // Allowed methods for Socket.IO
        credentials: true // Allow credentials
    }
});

// Google Authentication Routes


  


app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


const usp = io.of('/user-namespace'); 

let users = [];
usp.on('connection', async function(socket) {
    console.log(socket.id, "connected");

  socket.on('adduser', (userid) => {
    const existingUser = users.find(user => user.userid === userid);

    if (existingUser) {
        existingUser.socketId = socket.id; 
    } else {
        users.push({ userid, socketId: socket.id });
    }

    usp.emit('getUser', users);
});


    socket.on('sendMessage', async ({ sender_id, conversation_id, message, reciver_id }) => {
        const receiver = users.find(user => user.userid === reciver_id);
        let sender = users.find(user => user.userid === sender_id);

        if (!sender) {
            // console.error(`Sender with ID ${sender_id} not found in users array`);
           sender = { userid: sender_id, socketId: socket.id };
        users.push(sender);
        usp.emit('getUser', users); 
            
        }

        const user = await userModel.findById(sender_id);

        if (receiver) {
          console.log("receiver", receiver);
            usp.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                sender_id,
                message,
                conversation_id,
                reciver_id,
                user: { id: user._id, name: user.name, email: user.email }
            });
        } else {
          console.log("receiver not found, sending to sender only");
            usp.to(sender.socketId).emit('getMessage', {
                sender_id,
                message,
                conversation_id,
                reciver_id,
                user: { id: user._id, name: user.name, email: user.email }
            });
        }
    });

    socket.on('disconnect', async function() {
        console.log(socket.id, "disconnected");
        users = users.filter(user => user.socketId !== socket.id);
        usp.emit('getUser', users);
    });
});

// API Routes
app.use('/api', UserRoute);

// Listen on port 3000
server.listen(3000, () => {
    console.log("Server running on port 3000");
});

db();

