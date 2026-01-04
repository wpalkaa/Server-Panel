const fs = require('fs');
const path = require('path');
const archiver = require('archiver');


const fileSystemPath = path.join(__dirname, "../../fileSystem/home");

async function getTargetPath(pathToValidate = '', options = { mustExist: true}) {
    // Check if path leads to main file
    if( pathToValidate === '/home' ) {
        return fileSystemPath;
    }
    // Check if path is provided
    if(!pathToValidate) {
        console.error(`Error: Request rejected - path was not provided.`);
        throw { status: 400, message: "Path is required"};
    };
    
    // Check if target is in allowed directory
    const targetPath = path.join( fileSystemPath, pathToValidate !== '/' ? pathToValidate : '' );
    if(!targetPath.startsWith(fileSystemPath)) {
        console.error('Error: Request rejected - received illegal path.');
        throw { status: 400, message: "Invalid directory path"};
    };

    // Check if file exists
    try {
        await fs.promises.access(targetPath, fs.constants.F_OK);
        
        // If file can't exist - return Error
        if( !options.mustExist ) {
            console.error(`Error: Request rejected - file already exists.`)
            throw { status: 400, message: "File already exists" }
        }
    } catch(error) {

        // If file can't exist - resolve
        if( !options.mustExist) return targetPath

        
        console.error(`Error: Request rejected - file does not exists.`);
        throw { status: 404, message: "Invalid directory path" }
    }

    return targetPath;
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



exports.listFiles = async (req, res) => {
    const { path: requestPath = '' } = req.body;
    console.log('Debug: Received path:', requestPath);
    console.log(`Info: Received request to list files in directory: ${requestPath !== '/' ? '/home' + requestPath : '/home'}`);
    
    try {
        // Validate request path and get target path
        const targetPath = await getTargetPath(requestPath);

        console.log("Info: Request approved - sending files list...")


        // Read files in the target directory
        const files = await fs.promises.readdir(targetPath);

        // Get detailed info for each file
        const detailedFiles = await Promise.all(
            files.map( async (fileName) => {
                const filePath = path.join(targetPath, fileName);
                const stats = await fs.promises.stat(filePath);

                let totalSize = 0;
                if( !stats.isDirectory() ) {
                    totalSize = stats.size;
                } else {
                    totalSize = await calculateDirectorySize(filePath);
                };

                return {
                    name: fileName,
                    type: path.extname(fileName),
                    isDirectory: stats.isDirectory(),
                    size: totalSize,
                    lastModified: stats.mtime,
                    birthTime: stats.birthtime,
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
        if(!error.status) console.error(`Error: Couldn't read directory:\n${error}`);
        res.status( error.status || 500 ).json({
            success: false,
            message: error.message || 'Server error while reading directory'
        });
    };
};

exports.getFileInfo = async (req, res) => {
    const { path: requestPath = '' } = req.body;
    console.log('Debug: Received path:', requestPath);
    console.log(`Info: Received request to send info of file: ${requestPath !== '/' ? '/home' + requestPath : '/home'}`);
    
    try {
        // Validate request path and get target path
        const targetPath = await getTargetPath(requestPath);
        const fileName = path.basename(targetPath);

        console.log("Info: Request approved - sending file info...")

        // Get file statistics
        const stats = await fs.promises.stat(targetPath);
        let totalSize = 0;
                if( !stats.isDirectory() ) {
                    totalSize = stats.size;
                } else {
                    totalSize = await calculateDirectorySize(targetPath);
                };

        const fileInfo = {
            name: fileName,
            type: path.extname(fileName),
            isDirectory: stats.isDirectory(),
            size: totalSize,
            lastModified: stats.mtime,
            birthTime: stats.birthtime,
        };

        console.log(`Info: Request approved. Sending file info.`);
        res.status(200).json({
            success: true,
            directory: requestPath,
            fileInfo: fileInfo
        });
    } catch (error) {
        if(!error.status) console.error(`Error: Couldn't read directory:\n${error}`);
        res.status( error.status || 500 ).json({
            success: false,
            message: error.message || 'Server error while reading directory'
        });
    };
};


exports.getSize = async (req, res) => {

    const { path: requestPath = '' } = req.body;
    console.log('Debug: Received path:', requestPath);
    console.log(`Info: Received request to get size of file: ${requestPath !== '/' ? '/home' + requestPath : '/home'}`);
    
    try {
        // Validate request path and get target path
        const targetPath = await getTargetPath(requestPath);

        console.log("Info: Request approved - sending files list...")


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
        if(!error.status) console.error(`Error: Couldn't read directory:\n${error}`);
        res.status( error.status || 500 ).json({
            success: false,
            message: error.message || 'Server error while reading directory'
        });
    };
}


exports.downloadFile = async( req, res ) => {

    const { path: requestPath = '' } = req.body;
    console.log(req.body)
    console.log(`Info: Received download request for: ${requestPath !== '/' ? '/home' + requestPath : '/home'}`);

    try {
        // Validate request path and get target path
        const targetPath = await getTargetPath(requestPath);
        console.log(targetPath)

        console.log("Info: Request approved - sending files list...")

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
        };
    } catch (error) {
        if(!error.status) console.error(`Error: Couldn't read directory:\n${error}`);
        res.status( error.status || 500 ).json({
            success: false,
            message: error.message || 'Server error while reading directory'
        });
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
        // Validate request path and get target path
        const targetPath = await getTargetPath(requestPath);  // fileSystem + requestPath
        
        // New target path
        const targetDirname = path.dirname(targetPath)  // fileSystem + requestDirectory
        const newTargetPath = path.join(targetDirname, newName);

        // Validate new target path
        const pathToRenamedFile = path.relative( fileSystemPath, newTargetPath );
        await getTargetPath( pathToRenamedFile, { mustExist: false } );

        console.log("Info: Request approved - sending files list...")


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
        });

    } catch (error) {
        if(!error.status) console.error(`Error: Couldn't read directory:\n${error}`);
        res.status( error.status || 500 ).json({
            success: false,
            message: error.message || 'Server error while reading directory'
        });
    }
}