import parser from 'fast-xml-parser'

function compile(template) {
    const ojson = parser.parse(template, {
        attributeNamePrefix: '',
        attrNodeName: '#attrs',
        ignoreAttributes: false,
        allowBooleanAttributes: true
    })
    console.log('fast-xml-parser', ojson)
    const tree = parseChildren(ojson)
    return tree
}

function createElement(key, val) {
    const charCode = key.charCodeAt(0)
    const type = charCode > 64 && charCode < 91 ? 2 : 1
    const element = {
        type, // 1 =  host element；2 = 自定义组件
        tag: key, // 标签，对于host element，是 HTML 标签；对于component，是首字母大写自定义标签
        props: null, // 外部输入
        children: null, // 子元素
        slots: null, // 组件内容分发
        ref: null // host 元素 或者 component 实例 或者 虚拟 组件（if、text、loop等）
    }
    if (key !== 'Text') {
        element.props = parseAttrs(val['#attrs'])
        if (type === 1) {
            element.children = parseChildren(val)
        } else {
            element.slots = parseChildren(val)
        }
    } else {
        // 这个是文本节点，文本节点不包含任何子节点
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
        group[realKey] = convertExpression(attrs[key])
    }
    return groups
}

function convertExpression(express) {
    if (express === 'true') return true
    else if (express === 'false') return false
    else if (/^\d+$/.test(express)) return eval(express)
    else return express
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