import * as registery from './registery'
import * as $ from './query'
import {
    NodeTypes
} from './node-type'

function render(com, host) {
    const tree = com.render()
    renderNode(tree, host, com)
}

function renderNode(node, host, instance) {
    const {
        type
    } = node
    if (type === 1) {
        renderHost(node, host, instance)
    } else {
        renderComponent(node, host, instance)
    }
}

const renderChildren = (children, host, instance) => {
    if (children === null) return
    children.forEach(item => {
        renderNode(item, host, instance)
    })
}

function renderComponent(node, host, instance) {
    const {
        tag,
        props,
        children
    } = node
    const type = registery.get(tag)
    if (type === undefined) {
        throw new Error(`Component ${tag} is not registered.`)
    }
    const com = new type(props, children)
    console.log(com)
    com.$parentInstance = instance
    com.$fiber = node
    node.ref = com
    if (com.$isHostLike) {
        renderChildren(children, host, com)
    } else {
        const tree = com.render()
        setNodeTree(node, tree)
        renderNode(tree, host, com)
    }
}

const renderHost = (node, host, instance) => {
    const {
        tag, props, children
    } = node
    const domElement = document.createElement(tag)
    if (props) {
        const {
            attrs, events, binds
        } = props
        // attrs
        renderAttrs(domElement, attrs)
        // events
        bindEvents(domElement, events, instance)
        // binds
        bindValues(domElement, binds, instance)
    }
    host.appendChild(domElement)
    node.ref = domElement
    // children
    renderChildren(children, domElement, instance)
}

const renderAttrs = (domElement, attrs) => {
    for (let key in attrs) {
        renderAttr(domElement, key, attrs[key])
    }
}

const renderAttr = (domElement, key, value) => {
    if (domElement[key] !== undefined) {
        domElement[key] = value
    } else {
        domElement.setAttribute(key, value)
    }
}

const bindEvents = (domElement, events, instance) => {
    for (let key in events) {
        const handler = instance[events[key]]
        domElement.addEventListener(key, (evt) => {
            handler.call(instance, evt)
        })
    }
}

const bindValues = (domElement, bindings, instance) => {
    let field = ''
    for (let key in bindings) {
        field = bindings[key]
        // connect domElement - key - instance
        const [ val, ins, keyOnIns ] = instance.get(field)
        if (val === undefined) {
            throw new Error(`field ${field} is not defined`)
        }
        renderAttr(domElement, key, val)
        if (ins) {
            ins.watch(keyOnIns, function(nextVal, args) {
                const [domElement, key] = args
                renderAttr(domElement, key, nextVal)
            }, domElement, key)
        }
    }
}

const setNodeTree = (node, tree) => {
    if (tree.type !== NodeTypes.Root) {
        throw new Error('Tree must be with tag Root.')
    }
    node.child = tree
    tree.return = node
}

export {
    render
}