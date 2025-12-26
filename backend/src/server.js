
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config

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

const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;


app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Allowing requests from Nextjs server
    methods: ["GET", "POST"],
    credentials: true
}))


const USERS = [
    {
        login: 'admin',
        password: 'admin'
    }
];


app.get('/', (req, res) => {
    res.send("I am connected");
})

app.post('/api/login', (req, res) => {
    console.log(`Login request received for:\n${JSON.stringify(req.body)}`)
    const { login, password } = req.body;

    const user = USERS.find( u => u.login === login && u.password === password);

    if( user ) {
        console.log(`Login request approved.`)
        resData = {
            token: 'tokenikratata',
            user: { login: login }
        }
        res.cookie('user_session', JSON.stringify(resData), {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7d 24h 60min 60s 1000s = 7d
            httpOnly: false,
            path: '/'
        })

        return res.status(200).json({
            success: true
        });
    }

    console.log('Login request rejected - wrong login or password.')
    
    return res.status(401).json({
        success: false,
        message: 'Nieprawidłowy login lub hasło'
    })

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


server.listen(PORT, () => {
    console.log(`HTTP server and WebSocket are listening on port ${PORT}`);
});