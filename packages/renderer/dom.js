import * as componentsHub from '../core/components-hub'

const render =  (tree, host, instance) => {
    if (Array.isArray(tree)) {
        renderChildren(tree, host, instance)
    } else {
        const {
            type,
            tag
        } = tree
        if (type === 1) {
            renderHost(tree, host, instance)
        } else {
            if (tag === 'Text') {
                renderText(tree, host, instance)
            } else {
                renderComponent(tree, host, instance)
            }
        }
    }
}

const renderChildren = (children, host, instance) => {
    if (children === null) return
    children.forEach(item => {
        render(item, host, instance)
    })
}

const renderHost = (tree, host, instance) => {
    const {
        tag, props, children
    } = tree
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
    // children
    renderChildren(children, domElement, instance)
}

const renderText = (tree, host, instance) => {
    const { binds, attrs } = tree.props
    let textNode = null
    if (attrs.value) {
        textNode = document.createTextNode(attrs.value)
    } else {
        const [val, ins, key] = instance.get(binds.value)
        textNode = document.createTextNode(val)
        if (ins) {
            ins.watch(key, function(nextVal) {
                textNode.nodeValue = nextVal
            })
        }
    }
    host.appendChild(textNode)
}

const renderComponent = (tree, host, instance) => {
    const {
        tag,
        props,
        children
    } = tree
    const type = componentsHub.get(tag)
    if (type === undefined) {
        throw new Error(`component ${tag} is not registered.`)
    }
    const com = new type(props, children)
    com.$con = instance
    com.$el = host
    console.log(com)
    render(type.$tpl, host, com)
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
            ins.watch(keyOnIns, function(nextVal) {
                renderAttr(domElement, key, nextVal)
            })
        }
    }
}

export {
    render
}