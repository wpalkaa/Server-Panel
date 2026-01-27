function isNameValid(fileName) {
    if( !fileName || fileName.trim().length === 0 ) return false

    const illegalSymbols = /[\\/:*?"<>|]/;
    if( illegalSymbols.test(fileName) ) return false;

    return true;
};

module.exports = isNameValid