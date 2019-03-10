function should(bool, msg) {
    if (bool) return
    else throw new Error(msg)
}

function isUnvisibleChar(char) {
    return char === '\n' || char === '\t'
}

module.exports = {
    should,
    isUnvisibleChar
}