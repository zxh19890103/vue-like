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
        main(stream)
    })
    stream.on('end', () => {
        console.log('---READ END---')
        reader.setStream(null)
        // write json data into file.
        const root = stack.pick()
        if (root.type !== 3) {
            throw new Error('Template is not in right syntax.')
        }
        clean(root)
        fs.writeFile(
            path.resolve(__dirname, './output.json'),
            JSON.stringify(root),
            () => {
                console.log('saved!')
            })
    })
}

function clean(node) {
    const attrs = parseProps(node.__attrs)
    node.props = attrs
    delete node.__attrs
    if (node.children) {
        const children = []
        node.children.forEach(n => {
            if (typeof n === 'string') {
                const textNodes = parseTextNode(n)
                if (textNodes) {
                    children.push(...textNodes.filter(i => !!i))
                }
            } else {
                children.push(n)
                clean(n)
            }
        })
        node.children = children
    }
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

function parseProps(attrsStr) {
    // remove ' ' and  \t and \n
    // eg: "\n  style  =  \"color: #909090;\"\n"
    if (!attrsStr) return null
    let char = null
    let i = 0
    let name = ''
    let value = ''
    // 0 - before name
    // 1 - name
    // 2 - after name
    // 3 - before value
    // 4 - value
    // 0 - after value
    let stage = 0
    let props = {
    }
    while (true) {
        char = attrsStr[i]
        if (char === undefined) break
        if (stage === 0) {
            if (char === ':' || util.isaz(char)) {
                stage = 1
                name = char
            }
        } else if (stage === 1) {
            if (char === ' ' || char === '=') {
                stage = 2
            } else {
                name += char
            }
        } else if (stage === 2) {
            // expect `"`, but this may not appear. 
            if (char === '"') {
                stage = 3
            } else if (char === ':' || util.isaz(char)) {
                stage = 1
                props[name] = true
                // from start
                name = char
                value = ''
            }
        } else if (stage === 3) {
            stage = 4
            value += char
        } else if (stage === 4) {
            if (char === '"') {
                stage = 0 // next key-value pair.
                props[name] = value
                // from start
                name = ''
                value = ''
            } else {
                value += char
            }
        }
        i ++
    }
    return props
}

function parseTextNode(textStr) {
    // "v djfnfgfmfgkhfgjkh&lt;&lt;    \n\n\n",
    // sparate bindings and constants by {{}}
    // should `\n` or `\t` be in consideration ?
    if (!textStr) return null
    const removedBlanks = textStr.split(/[\n\t\s]/).filter(i => !!i).join(' ')
    return removedBlanks
        .replace(/{{/g, '\u0001{{')
        .replace(/}}/g, '}}\u0001')
        .split(/\u0001/)
        .map(item => {
            if (/^{{\w+}}$/.test(item)) {
                const element = createElement('Text', 2)
                element.props = {
                    ':value': item.substr(2, item.length - 4)
                }
                delete element.__attrs
                return element
            } else {
                return item
            }
        })
}

compile(path.resolve(__dirname, './tpl.html'))