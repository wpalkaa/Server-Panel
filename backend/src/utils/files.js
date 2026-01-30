const path = require('path');
const fs = require('fs');

function isNameValid(fileName) {
    if( !fileName || fileName.trim().length === 0 ) return false

    const illegalSymbols = /[\\/:*?"<>|]/;
    if( illegalSymbols.test(fileName) ) return false;

    return true;
};



async function getTargetPath(pathToValidate = '', fileSystemPath, options = { mustExist: true}) {
    // Check if path leads to main file
    if( pathToValidate === '/home' ) {
        return fileSystemPath;
    }
    // Check if path is provided
    if(!pathToValidate) {
        console.error(`[Error]: Request rejected - path was not provided.`);
        throw { status: 400, message: "noPath" };
    };
    
    // Check if target is in allowed directory
    const targetPath = path.join( fileSystemPath, pathToValidate !== '/' ? pathToValidate : '' );
    if(!targetPath.startsWith(fileSystemPath)) {
        console.error('[Error]: Request rejected - received illegal path.');
        throw { status: 400, message: "invalidDirectoryPath" };
    };

    // Check if file exists
    let exists = false;
    try {
        await fs.promises.access(targetPath, fs.constants.F_OK);
        exists = true;
    } catch(error) {
        exists = false;
    };
   
    console.log(`\n\n\n\n\nexist: ${exists}\nmust: ${options.mustExist}\n${targetPath}\n\n\n\n`)
    // File exists but cannot
    if( !options.mustExist && exists) {
        console.error(`[Error]: Request rejected - file already exists.`)
        throw { status: 409, message: "fileExists" }
    }
    // File must exist but does not
    if( options.mustExist && !exists) {
        console.error(`[Error]: Request rejected - file does not exists.`);
        throw { status: 404, message: "fileDoesNotExist" }
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

module.exports = { isNameValid, getTargetPath, calculateDirectorySize };