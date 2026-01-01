const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

exports.listFiles = async (req, res) => {
    const { path: requestPath = '' } = req.body;
    console.log('Debug: Received path:', requestPath);
    console.log(`Info: Received request to list files in directory: ${requestPath !== '/' ? '/home' + requestPath : '/home'}`);
    
    try {
        // The base file system path
        const fileSystemPath = path.join(__dirname, '../../fileSystem/home');
        // Path to the target directory
        const targetPath = path.join(fileSystemPath, requestPath);


        // Check if path is in the allowed directory
        if( !requestPath ) {
            console.error(`Error: Request rejected - path was not provided.`);

            return res.status(400).json({
                success: false,
                message: 'Path is required'
            });
        };

        // Check if file is in allowed directory
        if( !targetPath.startsWith(fileSystemPath) ) {
            console.error('Error: Request rejected - received illegal path.');

            return res.status(400).json({
                success: false,
                message: 'Invalid directory path'
            });
        };

        // Check if file exists
        fs.access(targetPath, fs.constants.F_OK, (error) => {
            if(error) {
                console.error(`Error: Request rejected - file does not exists.`);

                return res.status(404).json({
                    success: false,
                    message: 'Invalid directory path'
                })
            }
        })

        console.log("Info: Request approved - sending files list...")


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

        console.log(`Info: Request approved. Sending files list.`);
        res.status(200).json({
            success: true,
            directory: requestPath,
            files: detailedFiles
        });
    } catch (error) {
        console.error(`Error: Couldn't read directory:\n${error}`);
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

    const { path: requestPath = '' } = req.body;
    console.log('Debug: Received path:', requestPath);
    console.log(`Info: Received request to get size of file: ${requestPath !== '/' ? '/home' + requestPath : '/home'}`);
    
    try {
        // The base file system path
        const fileSystemPath = path.join(__dirname, '../../fileSystem/home');
        // Path to the target directory
        const targetPath = path.join(fileSystemPath, requestPath);


        // Check if path is in the allowed directory
        if( !requestPath ) {
            console.error(`Error: Request rejected - path was not provided.`);

            return res.status(400).json({
                success: false,
                message: 'Path is required'
            });
        };

        // Check if file is in allowed directory
        if( !targetPath.startsWith(fileSystemPath) ) {
            console.error('Error: Request rejected - received illegal path.');

            return res.status(400).json({
                success: false,
                message: 'Invalid directory path'
            });
        };

        // Check if file exists
        fs.access(targetPath, fs.constants.F_OK, (error) => {
            if(error) {
                console.error(`Error: Request rejected - file does not exist.`);

                return res.status(404).json({
                    success: false,
                    message: 'Invalid directory path'
                })
            }
        })

        console.log("Info: Request approved - sending file size...")


        let totalSize = 0;
        const fileStats = await fs.promises.stat(targetPath);

        // If directory, calculate size recursively
        if( !fileStats.isDirectory() ) {
            totalSize = fileStats.size;
        } else {
            totalSize = await calculateDirectorySize(targetPath);
        }

        console.log(`Info: Request approved. Sending file size.`);
        res.status(200).json({
            success: true,
            size: totalSize
        });
    } catch (error) {
        console.error(`Error: Couldn't read directory:\n${error}`);
        res.status(500).json({
            success: false,
            message: 'Server error while reading directory'
        });
    };
}


exports.downloadFile = async( req, res ) => {

    const { path: requestPath = '' } = req.body;
    console.log(`Info: Received download request for: ${requestPath !== '/' ? '/home' + requestPath : '/home'}`);

    try {
        // The base file system path
        const fileSystemPath = path.join(__dirname, '../../fileSystem/home');
        // Path to the target directory
        const targetPath = path.join(fileSystemPath, requestPath);


        // Check if path is in the allowed directory
        if( !requestPath ) {
            console.error(`Error: Request rejected - path was not provided.`);

            return res.status(400).json({
                success: false,
                message: 'Path is required'
            });
        };

        // Check if file is in allowed directory
        if( !targetPath.startsWith(fileSystemPath) ) {
            console.error('Error: Request rejected - received illegal path.');

            return res.status(400).json({
                success: false,
                message: 'Invalid directory path'
            });
        };

        // Check if file exists
        fs.access(targetPath, fs.constants.F_OK, (error) => {
            if(error) {
                console.error(`Error: Request rejected - file does not exist.`);

                return res.status(404).json({
                    success: false,
                    message: 'Invalid directory path'
                })
            }
        })

        console.log("Info: Request approved - sending file...")

        // If target is directory, zip it
        const stats = await fs.promises.stat(targetPath);

        if( stats.isDirectory() ) {
            // Setting up headers
            const fileName = path.basename(requestPath);
            res.attachment(`${fileName}.zip`);

            const archive = archiver("zip", {
                zlib: {level: 4}
            });

            archive.pipe(res);
            archive.directory(targetPath, false);

            archive.finalize();
            
        } else {
            res.download(targetPath);
        }
    } catch (error) {
        console.error(`Error: Couldn't send files to client:\n${error}`);

        res.status(500).json({
            success: false,
            message: 'Server error while reading directory'
        })
    }
}


function isNameValid(fileName) {
    if( !fileName || fileName.trim().length === 0 ) return false

    const illegalSymbols = /[\\/:*?"<>|]/;
    if( illegalSymbols.test(fileName) ) return false;

    return true;
};

exports.renameFile = async( req, res ) => {

    const { path: requestPath = '' } = req.body;
    const { newName } = req.body;
    console.log(`Info: Received rename request for: ${requestPath !== '/' ? '/home' + requestPath : '/home'} => ${newName}`);

    try {
        // The base file system path
        const fileSystemPath = path.join(__dirname, '../../fileSystem/home');
        // Path to the target directory
        const targetPath = path.join(fileSystemPath, requestPath);
        // New target path
        const targetDirname = path.dirname(targetPath)
        const newTargetPath = path.join(targetDirname, newName);


        // Check if path is in the allowed directory
        if( !requestPath ) {
            console.error(`Error: Path was not provided.`);

            return res.status(400).json({
                success: false,
                message: 'Path is required'
            });
        };

        // Check if file is in allowed directory
        if( !targetPath.startsWith(fileSystemPath) || !newTargetPath.startsWith(fileSystemPath) ) {
            console.error('Error: Request rejected. Received illegal path.');

            return res.status(400).json({
                success: false,
                message: 'Invalid directory path'
            });
        };

        // Check if file exists
        fs.access(targetPath, fs.constants.F_OK, (error) => {
            if(error) {
                console.error(`Error: Request rejected - file does not exist.`);
                
                return res.status(404).json({
                    success: false,
                    message: 'Invalid directory path'
                })
            }
        });
        // Check if file with new name already exists
        fs.access(newTargetPath, fs.constants.F_OK, (error) => {
            
            if(!error) {
                console.error(`Error: Request rejected - file already exists.`);

                return res.status(400).json({
                    success: false,
                    message: 'File already exists'
                })
            }
        });

        // Validate file name
        if( !isNameValid(newName) ) {
            console.error(`Error: Request rejected - new name is not allowed.`);

            return res.status(400).json({
                success: false,
                message: 'File name is not allowed'
            })
        }

        console.log("Info: request approved - renaming file...");
        // Rename
        await fs.promises.rename(targetPath, newTargetPath);

        res.status(200).json({
            success: true,
            message: 'File name has been changed'
        })

    } catch (error) {
        console.error(`Error: Couldn't rename the file:\n${error}`);

        res.status(500).json({
            success: false,
            message: 'Server error while renameing file'
        })
    }
}