import parser from 'fast-xml-parser'

function compile(template) {
    const ojson = parser.parse(template, {
        attributeNamePrefix: '',
        attrNodeName: '#attrs',
        ignoreAttributes: false,
        allowBooleanAttributes: true
    })
    const tree = parseChildren(ojson)
    return tree
}

function createElement(key, val) {
    const charCode = key.charCodeAt(0)
    const type = charCode > 64 && charCode < 91 ? 2 : 1
    const element = {
        type,
        tag: key,
        props: null,
        children: null
    }
    if (key !== 'Text') {
        element.props = parseAttrs(val['#attrs'])
        element.children = parseChildren(val)
    } else {
        const attrs = {}
        if (/^{{\w+}}$/.test(val)) {
            attrs[':value'] = val.substr(2, val.length - 4)
        } else {
            attrs['value'] = val
        }
        element.props = parseAttrs(attrs)
    }
    return element
}

function parseAttrs(attrs) {
    if (!attrs) return null
    let firstChar = ''
    let realKey = ''
    const groups = {
        events: {},
        binds: {},
        attrs: {}
    }
    let group = null
    for (let key in attrs) {
        // @ is event, : is bind.
        firstChar = key[0]
        if (firstChar === '@') {
            realKey = key.substr(1)
            group = groups.events
        } else if (firstChar === ':') {
            realKey = key.substr(1)
            group = groups.binds
        } else {
            realKey = key
            group = groups.attrs
        }
        group[realKey] = attrs[key]
    }
    return groups
}

function parseText(text) {
    if (!text) return []
    return text.split(/({{\w+}})/).filter(i => !!i).map(i => {
        return createElement('Text', i)
    })
}

function parseChildren(o) {
    let children = []
    let value = null
    if (typeof o === 'string') {
        children = parseText(o)
    } else {
        Object.keys(o).forEach(key => {
            if (key === '#attrs') {
                return
            } else if (key === '#text') {
                children.push(...parseText(o[key]))
            } else {
                value = o[key]
                children.push(createElement(key, value))
            }
        })
    }
    return children.length === 0 ? null : children
}

export {
    compile
}