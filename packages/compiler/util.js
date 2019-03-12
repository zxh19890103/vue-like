function should(bool, msg) {
    if (bool) return
    else throw new Error(msg)
}

function isEmpty(str) {
    let val = true
    let char = null
    for (let i in str) {
        char = str[i]
        if (char === ' ' || char === '\n' || char === '\t') {
           continue 
        }
        val = false
    }
    return val
}

function isAZ(char) {
    const code = char.charCodeAt(0)
    return code > 64 && code < 91
}

function isaz(char) {
    const code = char.charCodeAt(0)
    return code > 96 && code < 123
}

function isAZaz(char) {
    const code = char.charCodeAt(0)
    const isAZ = code > 64 && code < 91
    const isaz = code > 96 && code < 123
    return isAZ || isaz
}

module.exports = {
    should,
    isAZaz,
    isAZ,
    isaz,
    isEmpty
}