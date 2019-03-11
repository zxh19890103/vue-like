const util = require('./util')
const enums = require('./enums')

let stream = null
let lastChar = null
let currentChar = null

function readChar() {
    lastChar = currentChar
    currentChar = stream.read(1)
}

function readCloseTagName() {
    let name = ''
    while (true) {
        readChar()
        util.should(currentChar !== null, 'stream ends while readCloseTagName')
        if (currentChar === enums.GT) break
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
        if (is.tagNameStop()) {
            break
        } else if (currentChar === enums.GT) {
            isEnded = true
            break
        } else if (currentChar === enums.SLASH) {
            readChar()
            util.should(currentChar === enums.GT, 'Char should be `>` after `/`')
            isSelfClosed = true
            break
        }
        util.should(currentChar !== null, 'stream ends while readBeginTagName')
        name += currentChar
    }
    return [ name, isEnded, isSelfClosed]
}

function readProps() {
    util.should(is.tagNameStop(), 'Why is the currentChar not Empty (space | \\n | \\t)?')
    let propsExpr = ''
    let isSelfClosed = false
    while (true) {
        readChar()
        util.should(currentChar !== null, 'stream ends while readProps')
        if (currentChar === enums.SLASH) {
            readChar()
            util.should(currentChar === enums.GT, 'currentChar should be `>` after `/` in readProps')
            isSelfClosed = true
            break
        } else if (currentChar === enums.GT) {
            break
        }
        propsExpr += currentChar
    }
    return [propsExpr, isSelfClosed]
}

function readText() {
    let textExpr = currentChar
    let docIsOver = false
    let flag = -1
    while (true) {
        readChar()
        if (is.documentEnded()) {
            docIsOver = true
            break
        }
        if (currentChar === enums.LT) {
            // This may be the begin or the end of a tag, where text parsing should be stopped.
            // read one char further and check if it does be the begin or the end of a tag.           
            flag = is.validAfterLT()
            break
        } else {
            textExpr += currentChar
        }
    }
    return [ textExpr, docIsOver, flag]
}

const is = {
    validAfterLT: (read = true) => {
        util.should(currentChar === enums.LT, 'Why you don\'t give me `<` in is.validAfterLT')
        read && readChar()
        if (util.isAZaz(currentChar)) return enums.flags.BEGIN_OF_TAG
        else if (currentChar === enums.SLASH) return enums.flags.CLOSE_OF_TAG
        else util.should(false, 'Char should be [AZaz] or slash after `<` in is.validAfterLT')
    },
    tagNameStop: () => {
        return currentChar === ' ' || currentChar === '\t' || currentChar === '\n'
    },
    tagBegin: () => {
        if (lastChar === null || currentChar === null) return false
        return lastChar === '<' && util.isAZaz(currentChar)
    },
    tagClose: () => {
        if (lastChar === null || currentChar === null) return false
        return lastChar === '<' && currentChar === '/'
    },
    documentEnded: () => {
        return currentChar === null
    }
}

const get = {
    currentChar: () => currentChar,
    lastChar: () => lastChar,
    // null + null === 0
    twoChars: () => {
        return lastChar || '' + (currentChar || '')
    },
    typeOf: () => {
        if (currentChar === enums.LT) {
            return is.validAfterLT()
        } else {
            return enums.flags.TEXT
        }
    }
}

function setStream(_stream) {
    stream = _stream
}

module.exports = {
    setStream,
    readChar,
    readBeginTagName,
    readCloseTagName,
    readProps,
    readText,
    is,
    get
}