import parser from 'fast-xml-parser'
import { Tags, isBuiltInDirective } from './enum'

function compileHtml(template) {
    const json = parser.parse(template, {
        attributeNamePrefix: '',
        attrNodeName: '#attrs',
        ignoreAttributes: false,
        allowBooleanAttributes: true
    })
    return json
}

function virtualDomRender(o) {
    const root = createElement(Tags.Root)
    renderChidren(root, o)
    return root
}

function neverHasChildren(element) {
    const elementKey = element.key
    return elementKey === Tags.Text
}

function renderChidren(parent, o) {
    if (neverHasChildren(parent)) return
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
                const child = createElement(key, value)
                renderChidren(child, value)
                children.push(child)
            }
        })
    }
    if (children.length > 0) {
        const first = children.reduceRight((prev, cur) => {
            cur.sibling = prev
            cur.return = parent
            return cur
        }, null)
        parent.child = first
        const isHost = parent.type === 1 || parent.type === 3
        if (isBuiltInDirective(parent.tag) || isHost) {
            parent.children = children
        } else {
            parent.slots = children
        }
    }
}

function createElement(tag, val) {
    const charCode = tag.charCodeAt(0)
    let type = charCode > 64 && charCode < 91 ? 2 : 1
    if (tag === Tags.Root) type = 3
    const element = {
        type, // 1 =  host element；2 = 自定义组件
        tag, // 标签，对于host element，是 HTML 标签；对于component，是首字母大写自定义标签
        props: null, // 外部输入
        children: null, // 对于host组件 子元素
        slots: null, // 对于自定义组件 的子元素
        ref: null, // host 元素 或者 component 实例 或者 虚拟 组件（if、text、loop等）
        // Fiber
        return: null,
        child: null,
        sibling: null,
    }
    if (tag === Tags.Text) {
        // 这个是文本节点，文本节点不包含任何子节点
        const attrs = {}
        if (/^{{\w+}}$/.test(val)) {
            attrs[':value'] = val.substr(2, val.length - 4)
        } else {
            attrs['value'] = val
        }
        element.props = parseAttrs(attrs)
    } else if (tag === Tags.Root) {
        // nothing
    } else {
        element.props = parseAttrs(val['#attrs'])
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

export {
    compileHtml,
    renderChidren,
    virtualDomRender
}