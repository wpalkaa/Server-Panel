const fs = require('fs');
const path = require('path');

exports.getUsers = async (req, res) => {
    console.log(`[Info]: Received get users request.`);
    try {
        
        const usersPath = path.join(__dirname, "../../data/users.json");
        console.log(`[Debug]: Users data file path: ${usersPath}`)
        
        await fs.promises.access(usersPath, fs.constants.F_OK)
                
        const rawData = await fs.promises.readFile(usersPath, 'utf-8');
        const usersData = JSON.parse(rawData);

        console.log(`[Info]: Request approved. Sending users data.`)
        res.status(200).json({
            success: true,
            data: usersData,
        });
    } catch(error) {console.error(`[Error]: Internal server error:\n${error}`);
        res.status( 500 ).json({
            success: false,
            message: "Internal server error"
        })
    }
}