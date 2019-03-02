import * as registery from './registery'
import * as $ from './query'

// dom render, not virtual dom render

const render =  (nodeOrNodes, host, instance) => {
    if (Array.isArray(nodeOrNodes)) {
        renderChildren(nodeOrNodes, host, instance)
    } else {
        const {
            type,
            tag,
            props,
        } = nodeOrNodes
        if (type === 1) {
            renderHost(nodeOrNodes, host, instance)
        } else {
            renderComponent(nodeOrNodes, host, instance)
            // switch (tag) {
            //     case Tags.Root: {
            //         console.log('Root', nodeOrNodes)
            //         renderChildren(children, host, instance)
            //         break
            //     }
            //     case Tags.Text: {
            //         console.log('Text', nodeOrNodes)
            //         renderText(nodeOrNodes, host, instance)
            //         break
            //     }
            //     case Tags.If: {
            //         console.log('If', nodeOrNodes)
            //         const binds = props.binds
            //         const [val, ins, key] = instance.get(binds.value)
            //         if (val) {
            //             renderChildren(children, host, instance)
            //         }
            //         ins.watch(key, (nextVal, args) => {
            //             const [host, instance] = args
            //             if (nextVal) {
            //                 renderChildren(children, host, instance)
            //             } else {
            //                 removeChildren(children, host, instance)
            //             }
            //         }, host, instance)
            //         break
            //     }
            //     case Tags.Loop: {
            //         console.log('Loop', nodeOrNodes)
            //         break
            //     }
            //     case Tags.Slot: {
            //         // how to get the slot.
            //         console.log('Slot', nodeOrNodes)
            //         break
            //     }
            //     default: {
            //         renderComponent(nodeOrNodes, host, instance)
            //         break
            //     }
            // }
        }
    }
}

const renderChildren = (children, host, instance) => {
    if (children === null) return
    children.forEach(item => {
        render(item, host, instance)
    })
}

const removeChildren = (children, host, instance) => {
    if (children === null) return
    children.forEach(child => {
        host.removeChild(child.ref)
    })
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
    setNodeRef(node, domElement)
    // children
    renderChildren(children, domElement, instance)
}

const renderText = (node, host, instance) => {
    const { binds, attrs } = node.props
    let textNode = null
    if (attrs.value) {
        textNode = document.createTextNode(attrs.value)
    } else {
        const [val, ins, key] = instance.get(binds.value)
        textNode = document.createTextNode(val)
        if (ins) {
            ins.watch(key, function(nextVal, args) {
                const [textNode] = args
                textNode.nodeValue = nextVal
            }, textNode)
        }
    }
    host.appendChild(textNode)
    setNodeRef(node, textNode)
}

const renderComponent = (node, host, instance) => {
    const {
        tag,
        props,
        slots
    } = node
    const type = registery.get(tag)
    if (type === undefined) {
        throw new Error(`Component ${tag} is not registered.`)
    }
    const com = new type(props, slots)
    com.$parentInstance = instance
    com.$fiber = node
    setNodeRef(node, com)
    const tpl = com.render()
    setNodeChildren(node, tpl)
    render(tpl, host, com)
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

const setNodeRef = (node, ref) => {
    node.ref = ref
}

const setNodeChildren = (node, tree) => {
    if (tree.tag !== Tags.Root) {
        throw new Error('Tree must be with tag Root.')
    }
    const children = tree.children
    if (!children || children.length === 0) return
    children.forEach(c => {
        c.return = node
    })
    node.child = children[0]
    node.children = children
}

export {
    render,
    setNodeRef
}