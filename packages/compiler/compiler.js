/**
 * 1. starts from '<';
 * 2. reads bytes til meeting the first space;
 * 3. pushes a element with a tag concats with these bytes to stack, it's the tag;
 * 4. reads bytes to parse the attributes (it has detail. goto #PA);
 * 5. ends with '>';
 * 6. reads bytes til meeting the first '<' or non-space character.
 * 7. if it is '<': goto 1; else parse it as text (it has detail, goto #PT).
 * 8. ends with '<' or '</'
 * 9. reads bytes til meeting '</', and parse the tag name.
 * 10. pops a element check if the name equals to the parsed.
 * 11. if True, pass; else throw Error.
 * 
 * #PA parse attributes
 * 1. reads bytes til meeting the first non-empty character, mark it.
 * 2. reads bytes til meeting the first '=', and then you get a attribute name.
 * 3. parse value: reads bytes til meeting the first ' " ', mark it.
 * 4. parse value: read bytes til meeting the first ' " ', and then you get the value.
 * 5. goto 1;
 * 6. ends with first '>' or '/>'
 * 
 * #PT parse text
 * 1. reads bytes and puting them to a string.
 * 2. til meeting first '{{', mark it, at the same time you get a constant text.
 * 3. ends with '}}', and then you get a binding expression.
 * 4. goto 1;
 * 5. ends with '<' or '</'
 */
const fs = require('fs')
const path = require('path')
const util = require('./util')
const enums = require('./enums')
const reader = require('./reader')

const stack = {
    _initialized: false,
    _size: 0,
    _data: [],
    push(element) {
        this._data.push(element)
        this._size += 1
    },
    pop() {
        const element = this._data.pop()
        this._size -= 1
        return element
    },
    pick() {
        return this._data[this._size - 1]
    },
    init() {
        this.push(createElement('Root', 3))
        this._initialized = true
    }
}

function compile(filepath) {
    const stream = fs.createReadStream(filepath, {
        encoding: 'utf8',
        autoClose: true
    })
    stream.on('readable', () => {
        console.log(stream.isPaused())       
        main(stream)
    })
    stream.on('end', () => {
        console.log('---READ END---')
        reader.setStream(null)
        console.log(stack.pick())
    })
}

function main(stream) {
    if (stack._initialized) {
        reader.readChar()
        return
    }
    stack.init()
    reader.setStream(stream)
    loop()
}

function loop() {
    let flag = 0
    let end = false
    while (true) {
        if (end) break
        switch (flag) {
            case 0: {
                // this is a boot
                const [isEnd, nextFlag] = parseBoot()
                end = isEnd
                flag = nextFlag
                break
            }
            case enums.flags.BEGIN_OF_TAG: {
                // this is open of a tag
                parseTag()
                flag = 0
                break
            }
            case enums.flags.CLOSE_OF_TAG: {
                // this is close of a tag
                const tagName = reader.readCloseTagName()
                closeTag(tagName)
                flag = 0
                break
            }
            case enums.flags.TEXT: {
                const [isEnd, nextFlag] = parseText()
                end = isEnd
                flag = nextFlag
                break
            }
        }
    }
}

function parseTag() {
    const [tagName, ended, selfClosed] = reader.readBeginTagName()
    const element = beginTag(tagName)
    if (selfClosed) {
        closeTag(tagName)
        return
    }
    if (ended) return
    const [props, selfClosed2] = reader.readProps()
    element.__attrs = props
    if (selfClosed2) {
        closeTag(tagName)
    }
}

function parseText() {
    const [text, docIsOver, flag] = reader.readText()
    appendChild(text)
    return [docIsOver, flag]
}

function parseBoot() {
    reader.readChar()
    const end = reader.is.documentEnded()   
    const flag = reader.get.typeOf()
    return [end, flag]
}

function beginTag(tagname) {
    const element = createElement(tagname, util.isAZ(tagname) ? 2 : 1)
    appendChild(element)
    stack.push(element)
    return element
}

function closeTag(tagname) {
    const element = stack.pop()
    util.should(element.tag === tagname, 'The begin tagname should equal to the end')
}

function appendChild(element) {
    const parentElement = stack.pick()
    if (!parentElement.children) {
        parentElement.children= [element]
    } else {
        parentElement.children.push(element)
    }
}

function createElement(tag, type) {
    return {
        tag,
        type,
        props: {
        },
        __attrs: null,
        children: null
    }
}

compile(path.resolve(__dirname, './tpl.html'))