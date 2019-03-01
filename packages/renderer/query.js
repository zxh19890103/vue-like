import {
    NodeTypes
} from './node-type'

import {
    Tags
} from './enum'

/**
 * return [parent, left, node, right, index]
 * @param {*} node fiber node
 */
const findFiberLocation = (node) => {
    let returnFiber = node.return
    if (returnFiber === null) {
        throw new Error('parent fiber node is null?')
    }
    const index = returnFiber.children.findIndex(i => i === node)
    let left = returnFiber.children[index - 1]
    let right = returnFiber.children[index + 1]
    left = left ? left : null
    right = right ? right : null
    return [returnFiber, left, node, right, index]
}

const findDOMParentFiber = (node) => {
    let returnFiber = node.return
    if (returnFiber === null) {
        throw new Error('parent fiber node is null?')
    }
    while (returnFiber.type !== NodeTypes.Host) {
        returnFiber = returnFiber.return
    }
    return returnFiber
}

const findHostFiber = (node) => {
    let current = node
    while (current.type !== NodeTypes.Host) {
        current = node.return
    }
    return current
}

// 将节点卸载
const unload = (node) => {
    if (node.tag !== Tags.If) {
        throw new Error('Only If Component can be removed.')
    }
    let domParentNode = findDOMParentFiber(node)
    const ref = domParentNode.ref
    // dom remove
    node.children.forEach(c => {
        ref.removeChild(c.ref)
    })
    // for the dom has been removed, we need reset ref.
    walk(node, (n) => {
        n.ref = null
    })
}

// 在固定位置加载节点
const load = (node, render) => {
    let right = node.silbing
}

const walk = (node, perform) => {
    let current = node
    while (true) {
        perform(current)
        if (current.child === null) {
            const current = _walkNextIfNoChild(current, node)
            if (current === null) break
        } else {
            current = current.child
        }
    }
}

const _walkNextIfNoChild = (node, root) => {
    // back to parent
    let current = node
    while (current.silbing === null) {
        current = current.return
        if (current === root) {
            return null
        }
    }
    current = current.silbing
    return current
}

export {
    findDOMParentFiber,
    findFiberLocation,
    unload,
    load
}