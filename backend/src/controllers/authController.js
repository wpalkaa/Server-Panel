const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET_KEY = process.env.SECRET_KEY;

function getUsers () {
    const userFilePath = path.join( __dirname, '../../data/users.json' );
    const data = fs.readFileSync( userFilePath, 'utf-8' );

    return JSON.parse(data);
}


exports.login = (req, res) => {
    console.log(`[Info]: Login request received for:\n${JSON.stringify(req.body)}`);
    
    const USERS = getUsers();
    const { login, password } = req.body;
    
    const user = USERS.find( u => u.login === login && u.password === password);

    if( user ) {
        console.log(`Login request approved.`);
        
        // Generate JWT token
        const token = jwt.sign(  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            { login: user.login },
            SECRET_KEY,
            { expiresIn: '7d'}
        );

        res.cookie('user_session', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7d 24h 60min 60s 1000s = 7d
            httpOnly: true,
            path: '/'
        });

        return res.status(200).json({
            success: true,
            user: { login: user.login }
        });
    };

    console.log('[Info]: Login request rejected - wrong login or password.');
    
    return res.status(401).json({
        success: false,
        message: 'authRejected'
    });

};
