/**
 * Target:
 * Give a start string and an end string as boundaries.
 * Crap a block of text from a document.
 * 
 * Design:
 * 1. Find the start position.
 * 2. write chars to stream
 * 3. until the end position
 * 
 * Replace
 * 
 */

const fs = require('fs')
const path = require('path')

class Transform {   
    constructor(handler) {
        this._bufferCount = 1
        this._output = ''
        this._input = ''
        this._handler = handler
    }
    buffer(num) {
        this._bufferCount = num
        return this
    }
    nextChar(char) {
        this._input += char
        if (this._input.length === this._bufferCount) {
            this._output = this._handler(this._input)
            this._input = ''
            return this._output
        }
        return null
    }
}

let I = 0

class Walker {
    constructor({
        startText,
        endText,
        onWalkDone,
        replaceConfig
    }) {
        this._rs = null
        this._isText = false
        this._textPointer = -1
        this._ws = null
        this._onWalkDone = onWalkDone
        this.startText = startText
        this.endText = endText
        this.replaceConfig = replaceConfig

        this.nextUrl = null
        this.pageTitle = null
        this.bodyText = null
    }

    set readStream(stream) {
        if (typeof stream === 'string') {
            this._isText = true
        }
        this._rs = stream
    }

    walk() {
        this._doWalk()
        this._onWalkDone()
    }

    _doWalk() {
        const bodyFinder = this.rangeFinder(this.startText, this.endText)
        const titleFinder = this.rangeFinder('<title>', '</title>')
        let char = null
        while (true) {
            char = this.readChar()
            if (char === null) {
                this._endWalk()
                break
            }
            if (this.pageTitle === null) {
                this.pageTitle = titleFinder(char)
            }
            this.bodyText = bodyFinder(char)
            if (this.bodyText !== null) {
                this._endWalk()
                break
            }
        }
    }

    _endWalk() {
        if (this.bodyText !== null) {
            I ++
            const output = path.resolve(__dirname, `./output/${I}_${this.pageTitle}.htm`)
            let bodyText = this.bodyText
            if (this.replaceConfig) {
                this.replaceConfig.forEach(rep => {
                    bodyText = bodyText.replace(rep[0], rep[1])
                })
            }
            fs.writeFileSync(output, bodyText)
        }
        let c = null
        const nextFinder = this.nextLinkFinder()
        while (true) {
            c = this.readChar()
            if (c === null) break
            this.nextUrl = nextFinder(c)
            if (this.nextUrl !== null) break
        }
    }

    isBoolean(value) {
        return value === true || value === false
    }

    replace(searchValue, replacement) {
        const finder = this.finder(searchValue)
        let outChar = null
        return (inChar) => {
            outChar = finder(inChar)
            if (this.isBoolean(outChar)) {
                if (outChar === true) {
                    return replacement
                }
            } else {
                return outChar
            }
            return null
        }
    }

    nextLinkFinder() {
        const finder = this.finder('<span class="next right"><a href="')
        const size = '/view/1320.html'.length
        let out = null
        let stage = 0
        let buffer = 'http://c.biancheng.net'
        let i = 0
        return (char) => {
            if (stage === 0) {
                out = finder(char)
                stage = out === true ? 1 : 0
            } else if (stage === 1) {
                buffer += char
                i ++
                if (i === size) {
                    stage = 2
                }
            } else {
                // end
                return buffer
            }
            return null
        }
    }

    rangeFinder(sT, eT) {
        const sFinder = this.finder(sT)
        const eFinder = this.finder(eT)
        let range = ''
        let stage = 0
        let outChar = null
        return (char) => {
            if (stage === 0) {
                stage = sFinder(char) === true ? 1 : 0
            } else if (stage === 1) {
                outChar = eFinder(char)
                if (this.isBoolean(outChar)) {
                    stage = outChar ? 2 : 1
                } else {
                    range += outChar
                }
            } else {
                return range
            }
            return null
        }        
    }

    finder(str) {
        const L = str.length
        let buffer = ''
        let i = 0
        return (char) => {
            buffer += char
            i ++
            if (buffer === str) {
                buffer = ''
                i = 0
                return true
            }
            if (i === L) {
                const firstChar = buffer[0]
                buffer = buffer.substr(1)
                i --
                return firstChar
            }
            return false
        }
    }

    readChar() {
        if (this._isText) {
            this._textPointer ++
            const char = this._rs[this._textPointer]
            if (char === undefined) {
                return null
            }
            return char
        } else {
            return this._rs.read(1)
        }
    }

    writeChar(char) {
        if (char === null || char === undefined) return
        this._ws.write(char)
    }
}

module.exports = Walker