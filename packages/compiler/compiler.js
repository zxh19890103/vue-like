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

const tagsStack = [
    createElement('Root', 3)
]

function compile(filepath) {
    const stream = fs.createReadStream(filepath, {
        encoding: 'utf8',
        autoClose: true
    })
    stream.on('readable', () => {
        parse(stream)
    })
    stream.on('end', () => {
        console.log('end')
    })
}

function parse(stream) {
    let char = ''
    let isClosing = 0
    let isOpenning = 0
    while (true) {
        char = stream.read(1)
        if (char === null) {
            // end
            break
        }
        if (char === '<') {
            isClosing = 1
            isOpenning = 1
        } else if (char === '/') {
            if (isClosing === 1) {
                isClosing = 0
                char = tagClose(stream, tagsStack)
            }
        } else if (isUnvisibleChar(char)) {
            isClosing = 0
            isOpenning = 0
            char = skipUnvisibleChars(stream, char)
        } else {
            isClosing = 0
            if (isOpenning) {
                isOpenning = 0
                char = parseTag(stream, char)
            } else {
                isOpenning = 0
                char = parseText(stream, char)
            }
        }
    }
}

function parseTag(stream, firstChar) {
    const tagType = isFirstCharAZaz(firstChar)
    if (tagType === 0) {
        throw new Error('First char of Tag must be a-zA-Z')
    }
    const [tag, ended, closed, nextChar] = tagOpen(stream, firstChar)
    const element = createElement(tag, tagType)
    tagsStack.push(element)
    if (closed) {
        tagClose(null, tagsStack)
        return nextChar
    } else {
        if (ended) {
            return nextChar
        } else {
            const [attrs, closed2, nextChar2] = parseAttributes(stream)
            element.__attrs = attrs
            if (closed2) {
                tagClose(null, tagsStack)
            }
            return nextChar2
        }
    }
}

function tagOpen(stream, firstChar) {
    let char = firstChar
    let tagName = char
    let isEnded = false // the begin tag ends
    let isClosed = 0 // 0 - no , 2 - yes // the tag is closed
    while (true) {
        char = stream.read(1)
        if (char === ' ') break
        if (char === '/') isClosed = 1
        if (char === '>') {
            if (isClosed === 1) {
                isClosed = 2
            }
            isEnded = true
            char = stream.read(1)
            break
        } else {
            isClosed = 0
        }
        tagName += char
    }
    return [tagName, isEnded, isClosed === 2, char]
}

function tagClose(stream, stack) {
    const element = stack.pop()
    if (stream !== null) {
        let char = ''
        let i = 0
        let wantTagName = element.tag
        while (true) {
            char = stream.read(1)
            if (char === '>') {
                return stream.read(1)
            }
            if (wantTagName[i] !== char) {
                throw new Error(`Wrong end tag with name: ${wantTagName}`)
            }
            i ++
        }
    }
}

function skipUnvisibleChars(stream, firstChar) {
    let char = firstChar
    while (true) {
        if (isUnvisibleChar(char)) {
            char = stream.read(1)
        } else {
            return char
        }
    }
}

function isUnvisibleChar(char) {
    return char === ' ' || char === '\t' || char === '\n'
}

// todo:
function parseAttributes(stream) {
    let char = ''
    let isClosed = 0
    let attributes = ''
    while (true) {
        char = stream.read(1)
        attributes += char
        if (char === '/') isClosed = 1
        if (char === '>') {
            if (isClosed === 1) {
                isClosed = 2
            }
            char = stream.read(1)
            break
        } else {
            isClosed = 0
        }
    }
    return [
        attributes,
        isClosed,
        char
    ]
}

// function parseAttributeBegin(stream, firstChar) {
//     let char = ''
//     let key = firstChar
//     let value = null
//     let isClosed = 0
//     let isEnded = false
//     let isPostEqualSymbol = false
//     let isValueBegin = false
//     while (true) {
//         char = stream.read(1)
//         if (char === '=') {
//             isPostEqualSymbol = true
//             continue
//         }
//         if (char === '"') {
//             isValueBegin = true
//             continue
//         }
//         if (char === '/') isClosed = 1
//         if (char === ' ') {
//             const char = tryFindingEqualSymbol(stream)
//             if (char === '=')
//             break
//         }
//         if (char === '>') {
//             if (isClosed === 1) isClosed = 2
//             isEnded = true
//             break
//         } else {
//             isClosed = 0
//         }
//         if (isPostEqualSymbol) {
//             value += char
//         } else {
//             key += char
//         }
//     }
//     return [
//         key,
//         value,
//         isEnded,
//         isClosed
//     ]
// }

// function tryFindingEqualSymbol(stream) {
//     let char = ''
//     while (true) {
//         char = stream.read(1)
//         if (char === ' ') continue
//         return char
//     }
// }

function parseText(stream, firstChar) {
    let char = firstChar
    let text = char
    while (true) {
        char = stream.read(1)
        if (char === '<') {
            break
        }
        text += char
    }
    const element = createElement('Text', 2)
    element.props.value = text
    appendChild(element)
    return char
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

/**
 * A-Z return 2
 * a-z return 1
 * else return 0
 */
function isFirstCharAZaz(str) {
    if (!str) return 0
    const firstCharCode = str.charCodeAt(0)
    if (firstCharCode > 64 && firstCharCode < 91) {
        return 2
    } else if (firstCharCode > 96 && firstCharCode < 123) {
        return 1
    } else {
        return 0
    }
}

function appendChild(element) {
    const parentElement = tagsStack[tagsStack.length - 1]
    if (!parentElement.children) {
        parentElement.children= [element]
    } else {
        parentElement.children.push(element)
    }
}

compile(path.resolve('./tpl.html'))