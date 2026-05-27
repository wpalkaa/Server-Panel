const fs = require('fs');

function loadSecret(filePath) {
    if( filePath && fs.existsSync(filePath) ) {
        return fs.readFileSync(filePath, 'utf-8').trim();
    }

    throw new Error(`[CRITICAL]: There was no secret in ${filePath}.`);
}

module.exports = {
    jwtSecret: loadSecret(process.env.JWT_SECRET_FILE),
}