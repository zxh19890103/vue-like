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
        console.log('readable')
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
    test()
}

function test() {
    while (true) {
        reader.readChar(2)
        console.log('>>', reader.getTwoChars())
        const isDocEnded = reader.isDocumentEnded()
        if (isDocEnded) break
        parseText()
    }
}

function parseInner() {
    while (true) {
        reader.readChar(2)
        console.log('>>', reader.getTwoChars())
        const isDocEnded = reader.isDocumentEnded()
        if (isDocEnded) {
            console.log('---Over---')
            break
        }
        const isTagBegin = reader.isTagBegin()
        const isTagClose = reader.isTagClose()
        if (isTagBegin) {
            parseTag()
        } else if (isTagClose) {
            const name = reader.readCloseTagName()
            closeTag(name)
        } else {
            parseText()
        }
    }
}

function parseTag() {
    const [tagname, ended, closed] = reader.readBeginTagName()
    const element = beginTag(tagname)
    if (closed) {
        closeTag(tagname)
        return
    }
    if (!ended) {
        const [props, closed] = reader.readProps()
        element.__attrs = props
        if (closed) {
            closeTag(tagname)
        }
    }
}

function parseText() {
    const text = reader.readText()
    console.log(text)
    appendChild(text)
}

function beginTag(tagname) {
    const element = createElement(tagname, 1)
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