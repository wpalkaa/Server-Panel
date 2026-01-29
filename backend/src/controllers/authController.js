const jwt = require('jsonwebtoken');

const { isNameValid } = require('../utils/files');
const SECRET_KEY = process.env.SECRET_KEY;

const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.login = async (req, res) => {
    console.log(`[Info]: Login request received for:\n`, req.body);
    const { login, password } = req.body;

    try{
        const user = await User.findOne({ login });

        if(!user) throw { status: 401, message: 'authRejected' };

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw { status: 401, message: 'authRejected' };

        console.log(`[Info]: Login request approved for ${user.login}`);


        // Generate JWT token
        const token = jwt.sign(  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            {
                userId: user._id,
                login: user.login,
                group: user.group    
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.cookie('user_session', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7d 24h 60min 60s 1000s = 7d
            httpOnly: true,
            secure: true,
            sameSime: 'none',
            path: '/'
        });

        return res.status(200).json({
            success: true,
            user: { 
                    login: user.login,
                    group: user.group 
                }
        });
    } catch(error) {
        if(error.status)console.log('[Info]: Login request rejected - wrong login or password.');
        else console.log(`[Error]: Server error on login request: \n`, error)
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'server'
        });
    };
};

exports.register = async (req, res) => {
    const { login, password, group } = req.body;
    console.log(`[Info]: Register request received for:`, login);

    try {
        const loginLength = login.length;
        if( loginLength < 3 || loginLength > 20 || !isNameValid(login) ) throw { status: 400, message: "invalidLogin" };

        const existingUser = await User.findOne({ login });
        if(existingUser) throw { status: 409, message: "userExists" };

        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await User.create({
            login,
            password: hashedPassword,
            group
        });
        console.log(`[Info]: Request accepted. New user has been created.`);
        
        return res.status(201).json({
            success: true
        });
    } catch(error) {
        if(error.status) console.log(`[Info]: Couldn't create user: ${error.message}`);
        else console.log(`[Error]: Server error on register request:\n`, error)
        res.status( error.status || 500 ).json({
            success: false,
            message: error.message || 'server'
        });
    }
}
