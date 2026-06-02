
const SECRET_KEY = process.env.SECRET_KEY;
const { isNameValid } = require('../utils/files');

const User = require('../models/User');
const bcrypt = require('bcryptjs');

const clearUserCache = async (redisClient) => {
    try {
        const keys = await redisClient.keys('users:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`[Info]: Redis cache for users has been cleared.`);
        }
    } catch (err) {
        console.error(`[Error]: Failed to clear Redis cache: ${err}`);
    }
};

exports.getUsers = async (req, res) => {
    const { search } = req.query;
    const redisClient = req.redisClient
    console.log(`[Info]: Get users list request received${search ? ` with params: ${search}` : ''}.`);
    
    try {
        const cacheKey = `users:list:${search || 'all'}`;

        if (redisClient && redisClient.isOpen) {
            const cachedUsers = await redisClient.get(cacheKey);
            if (cachedUsers) {
                console.log(`[Info]: Request approved. Sending users list (Served from Redis).`);
                return res.status(200).json(JSON.parse(cachedUsers));
            }
        }

        const filter = {};
        if(search) {
            filter.login = { $regex: search, $options: 'i' }
        }

        const users = await User.find(filter).select("-password");
        const responseData = {
            success: true,
            data: users
        }
        
        if (redisClient && redisClient.isOpen) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));
        }

        console.log(`[Info]: Request approved. Sending users list.`)
        return res.status(200).json(responseData);
    } catch(error) {
        console.log(`[Error]: Error on get users request: ${error}`);
        return res.status(500).json({
            success: false,
            message: "server"
        });
    };
};

exports.getUserData = async (req, res) => {
    const { login } = req.params;
    const redisClient = req.redisClient;
    console.log(`[Info]: Get user data request received for: ${login}`);

    try {
        const cacheKey = `users:data:${login}`;
        
        if (redisClient && redisClient.isOpen) {
            const cachedUser = await redisClient.get(cacheKey);
            if (cachedUser) {
                console.log(`[Info]: Request approved. Sending user data (Served from Redis).`);
                return res.status(200).json(JSON.parse(cachedUser));
            }
        }

        const user = await User.findOne({ login: login }).select('-password');
        if(!user) throw { status: 404, message: "userNotFound" };

        const responseData = {
            success: true,
            data: user
        };
        if (redisClient && redisClient.isOpen) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));
        }

        console.log(`[Info]: Request approved. Sending user data.`)
        return res.status(200).json(responseData);
    } catch(error) {
        if(error.message) console.log(`[Info]: Request rejected - ${error.message}`)
        else console.log(`[Error]: Error on get user data request: ${error}`);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "server"
        });        
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const redisClient = req.redisClient;
    console.log(`[Info]: Delete user request received for user id: ${id}.`);
    
    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if(!deletedUser) throw { status: 404, message: "userNotFound" };

        if (redisClient && redisClient.isOpen) {
            await clearUserCache(redisClient);
        }

        console.log(`[Info]: Request approved. User has been deleted.`)
        return res.status(200).json({
            success: true
        });
    } catch(error) {
        if(error.message) console.log(`[Info]: Request rejected - ${error.message}`)
        else console.log(`[Error]: Error on delete user request: ${error}`);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "server"
        });
    };
};

exports.createUser = async (req, res) => {
    const { login, password, group } = req.body;
    const redisClient = req.redisClient;
    console.log(`[Info]: Register request received for:`, login);

    try {
        const loginLength = login.length;
        if( loginLength < 3 || loginLength > 20 || !isNameValid(login) ) throw { status: 400, message: "invalidLogin" };

        const existingUser = await User.findOne({ login });
        if(existingUser) throw { status: 409, message: "userExists" };

        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            login,
            password: hashedPassword,
            group
        });
        console.log(`[Info]: Request accepted. New user has been created.`);

        if (redisClient && redisClient.isOpen) {
            await clearUserCache(redisClient);
        }
        
        return res.status(201).json({
            success: true,
            userId: newUser._id
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
