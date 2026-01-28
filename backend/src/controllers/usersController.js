
const SECRET_KEY = process.env.SECRET_KEY;
const User = require('../models/User');

exports.getUsers = async (req, res) => {
    console.log(`[Info]: Get users list request received.`);
    
    try {
        const users = await User.find().select("-password");

        console.log(`[Info]: Request approved. Sending users list.`)
        return res.status(200).json({
            success: true,
            data: users
        });
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
    console.log(`[Info]: Get user data request received for: ${login}`);

    try {
        const user = await User.findOne({ login: login }).select('-password');

        if(!user) throw { status: 404, message: "userNotFound" };

        console.log(`[Info]: Request approved. Sending user data.`)
        return res.status(200).json({
            success: true,
            data: user
        });
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
    console.log(`[Info]: Delete user request received for user id: ${id}.`);
    
    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if(!deletedUser) throw { status: 404, message: "userNotFound" };

        console.log(`[Info]: Request approved. User has been deleted.`)
        return res.status(200).json({
            success: true
        });
    } catch(error) {
        if(error.message) console.log(`[Info]: Request rejected - ${error.message}`)
        else console.log(`[Error]: Error on delete user request: ${error}`);
        return res.status(error.status || 500).json({
            success: false,
            message: "server"
        });
    };
};