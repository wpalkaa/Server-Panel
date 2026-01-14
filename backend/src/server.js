require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const settingsRoutes = require('./routes/settingsRoutes')
const socket = require('./socket');


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



// Routes
app.use( '/api/auth', authRoutes );
app.use( '/api/files', fileRoutes );
app.use( '/api/settings', settingsRoutes )

app.get('/', (req, res) => {
    res.send("I am connected");
});


// WebSocket
socket( io );



const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`HTTP server and WebSocket are listening on port ${PORT}`);
});
