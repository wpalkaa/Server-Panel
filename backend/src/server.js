require('dotenv').config();
const express = require('express');
const https = require('https');
const { Server } = require('socket.io');
const cors = require('cors');

const mongoose = require('mongoose');
const socket = require('./socket');
const cookieParser = require('cookie-parser');
const fs = require('fs')

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const usersRoutes = require('./routes/usersRoutes');


// Initialize Express and HTTP server
const app = express();

const options = {
 key: fs.readFileSync('./localhost-key.pem'),
 cert: fs.readFileSync('./localhost.pem'),
};

const server = https.createServer(options, app);
const io = new Server( server, {
    cors: {
        origin: 'https://localhost:3000', // Allowing requests from Nextjs server
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true
} );



// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://localhost:3000', // Allowing requests from Nextjs server
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}))
app.use(cookieParser());

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


// For tests
module.exports = server;