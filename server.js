// Import the http module to create an HTTP server
const http = require('http');
// Import the Server class from the socket.io module
const {Server} = require('socket.io');

const cors = require('cors');
// Create a new HTTP server
const server = http.createServer();

// Create a new instance of the Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Replace with your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
// Listen for a connection event and execute the callback function when a client connects
io.on('connection',(socket) => {
    // Log a message when a user is connected
    console.log("A user connected:", socket.id);

    // Listen for 'chat message' events and broadcast the message to all connected clients
    socket.on('join room',(roomId)=>{
        socket.join(roomId);
        console.log('user with id-${socket.id} joined room - ${roomId}');
    })

    socket.on('send message',(message)=>{
        console.log(`user with id-${socket.id} joined room - ${message}`);

        socket.to(message.roomId).emit("receive_msg",message);
    })
    // Listen for 'disconnect' events and log a message when a client disconnects
    socket.on('disconnect',()=>{
        console.log("A user disconnected:", socket.id);
    })
})

// Start the HTTP server and listen on port 3004
server.listen(3004,()=>{
    console.log("Server running on port 3004");
})
