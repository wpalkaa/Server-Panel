const fs = require('fs');
const path = require('path');

exports.listFiles = async (req, res) => {
    // console.log('Debug: Path params received:', req.params.path);
    const directory = req.params.path.join('/')
    console.log('Received request to list files in directory:', (directory));
    
    try {
        const fileSystemPath = path.join(__dirname, '../../fileSystem');
        const targetPath = path.join(fileSystemPath, directory);
        
        if( !targetPath.startsWith(fileSystemPath) ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid directory path'
            });
        };

        const files = await fs.promises.readdir(targetPath);

        const detailedFiles = await Promise.all(
            files.map( async (fileName) => {
                const filePath = path.join(targetPath, fileName);
                const stats = await fs.promises.stat(filePath);

                return {
                    name: fileName,
                    type: path.extname(fileName),
                    isDirectory: stats.isDirectory(),
                    size: stats.size,
                    lastModified: stats.mtime,
                    birthTime: stats.birthTime,             
                };
            })
        );

        res.status(200).json({
            success: true,
            directory: directory,
            files: detailedFiles
        });
    } catch (error) {
        console.error('Error reading directory:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while reading directory'
        });
    };
};
