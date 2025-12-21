
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server( server, {
    cors: {
        origin: "http://localhost:3000", // Allowing requests from Nextjs server
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true
} );

app.get('/', (req, res) => {
    res.send("I am connected");
})

// ============ WebSocket handling ============

io.on('connection', (socket) => {
    console.log("Client successfully connected via WebSocket!");
    socket.send("Server: WebSocket connection established.");


    socket.on('message', (message) => {
        console.log("Received message: %s", message);
    });

    socket.on('data request', (msg) => {
        console.log("Data request received for chartId: ", msg.chartId);

        // Simulate sending data updates every 2 seconds
        const intervalId = setInterval( () => {
            const data = {
                time: new Date().toLocaleTimeString("it-IT")
            };

            switch( msg.chartId ) {
                case 'cpu':
                    data.value = Math.random() * 100;
                    break;

                case 'memory':
                    data.value = Math.random() * 8000;
                    break;
                
                case 'disk':
                    data.value = Math.random() * 10;
                    break;
                
                default:
                    console.error("Unknown chartId requested: ", msg.chartId);
                    data.value = null;
                    break;
            }

            socket.emit('data update', { data : data } );
        }, 2000);
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected.");
        // clearInterval(intervalId);
    });
});



server.listen(8000, () => {
    console.log("HTTP server and WebSocket are listening on port 8000");
});