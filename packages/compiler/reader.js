const util = require('./util')
const enums = require('./enums')

let stream = null
let lastChar = null
let currentChar = null

function readChar(times = 1) {
    for (let i = 0; i < times; i ++) {
        lastChar = currentChar
        currentChar = stream.read(1)
    }
}

function readCloseTagName() {
    let name = ''
    while (true) {
        readChar()
        if (currentChar === enums.END_OF_TAG_OPEN) break
        util.should(currentChar !== null, 'stream ends while readCloseTagName')
        name += currentChar
    }
    return name
}

function readBeginTagName() {
    let name = currentChar
    let isEnded = false
    let isSelfClosed = false
    while (true) {
        readChar()
        if (currentChar === enums.EMPTY) {
            break
        } else if (currentChar === enums.END_OF_TAG_OPEN) {
            isEnded = true
            break
        } else if (currentChar === enums.SLASH) {
            readChar()
            util.should(currentChar === enums.END_OF_TAG_OPEN, 'Char should be `>` after `/`')
            isSelfClosed = true
            break
        } else if (util.isUnvisibleChar(currentChar)) {
            util.should(false, 'unvisible char while readBeginTagName')
        }
        util.should(currentChar !== null, 'stream ends while readBeginTagName')
        name += currentChar
    }
    return [ name, isEnded, isSelfClosed]
}

function readProps() {
    util.should(currentChar === enums.EMPTY, 'Why is the currentChar not Empty?')
    let propsExpr = ''
    let isSelfClosed = false
    while (true) {
        readChar()
        if (currentChar === enums.END_OF_TAG_OPEN) {
            if (lastChar === enums.SLASH) {
                isSelfClosed = true
            }
            break
        }
        if (currentChar === null) break
        propsExpr += currentChar
    }
    return [propsExpr, isSelfClosed]
}

function readText() {
    let textExpr = getTwoChars()
    while (true) {
        readChar(2)
        util.should(currentChar !== null, 'stream ends while readText')
        if (isTagBegin() || isTagClose()) break
        if (currentChar === enums.SLASH) continue
        textExpr += currentChar
    }
    return textExpr
}

function isTagBegin() {
    if (lastChar === null || currentChar === null) return false
    const charCode = currentChar.charCodeAt(0)
    const isAZ = charCode > 64 && charCode < 91
    const isaz = charCode > 96 && charCode < 123
    return lastChar === '<' && (isAZ || isaz)
}

function isTagClose() {
    if (lastChar === null || currentChar === null) return false
    return lastChar === '<' && currentChar === '/'
}

function isDocumentEnded() {
    return currentChar === null
}

function setStream(_stream) {
    stream = _stream
}

function getCurrentChar() {
    return currentChar
}

function getLastChar() {
    return lastChar
}

function getTwoChars() {
    return lastChar + currentChar
}

module.exports = {
    setStream,
    readChar,
    isTagBegin,
    isTagClose,
    readBeginTagName,
    readCloseTagName,
    readProps,
    readText,
    isDocumentEnded,
    getCurrentChar,
    getLastChar,
    getTwoChars
}