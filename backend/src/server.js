require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const mongoose = require('mongoose');
const socket = require('./socket');

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const usersRoutes = require('./routes/usersRoutes');


// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server( server, {
    cors: {
        origin: 'http://localhost:3000', // Allowing requests from Nextjs server
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true
} );



// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allowing requests from Nextjs server
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then( () => console.log('[Info]: Connected to database.') )
    .catch( (err) => console.log(`[Error]: Couldn't connect to database: \n${err}`) );



// Routes
app.use( '/api/auth', authRoutes );
app.use( '/api/files', fileRoutes );
app.use( '/api/users', usersRoutes)

// WebSocket
socket( io );



const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`[Info]: HTTP server and WebSocket are listening on port ${PORT}`);
});
