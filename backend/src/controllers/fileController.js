const fs = require('fs');
const path = require('path');

exports.listFiles = async (req, res) => {
    // console.log('Debug: Path params received:', req.params.path);

    const pathSegments = req.params.path || [];
    const directory = pathSegments.join('/');
    console.log(`Received request to list files in directory: ${directory ? '/home/' + directory : '/home'}`);
    
    try {
        // The base file system path
        const fileSystemPath = path.join(__dirname, '../../fileSystem/home');
        // Path to the target directory
        const targetPath = path.join(fileSystemPath, directory);
        
        // Check if path is in the allowed directory
        if( !targetPath.startsWith(fileSystemPath) ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid directory path'
            });
        };

        // Read files in the target directory
        const files = await fs.promises.readdir(targetPath);

        // Get detailed info for each file
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




async function calculateDirectorySize(dirPath) {
    const files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    let totalSize = 0;

    for( const file of files ) {
        const filePath = path.join(dirPath, file.name);

        if( file.isDirectory() ) {
            totalSize += await calculateDirectorySize(filePath);
        } else {
            const fileStats = await fs.promises.stat(filePath);
            totalSize += fileStats.size;
        }
    }

    return totalSize;
};


exports.getSize = async (req, res) => {

    const pathSegments = req.params.path || [];
    const directory = pathSegments.join('/');
    console.log(`Received request to get size of file: ${directory ? '/home/' + directory : '/home'}`);
    
    try {
        // The base file system path
        const fileSystemPath = path.join(__dirname, '../../fileSystem/home');
        // Path to the target directory
        const targetPath = path.join(fileSystemPath, directory);
        
        // Check if path is in the allowed directory
        if( !targetPath.startsWith(fileSystemPath) ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid directory path'
            });
        };

        let totalSize = 0;
        const fileStats = await fs.promises.stat(targetPath);

        // If directory, calculate size recursively
        if( !fileStats.isDirectory() ) {
            totalSize = fileStats.size;
        } else {
            totalSize = await calculateDirectorySize(targetPath);
        }

        res.status(200).json({
            success: true,
            size: totalSize
        });
    } catch (error) {
        console.error('Error reading directory:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while reading directory'
        });
    };
}