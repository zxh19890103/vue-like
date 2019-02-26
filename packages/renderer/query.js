import {
    NodeTypes
} from './node-type'

import {
    Tags
} from './built-in'

/**
 * return [parent, left, node, right, index]
 * @param {*} node fiber node
 */
const findDOMLocation = (node) => {
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

const findDOMParent = (node) => {
    let returnFiber = node.return
    if (returnFiber === null) {
        throw new Error('parent fiber node is null?')
    }
    while (returnFiber.type !== NodeTypes.Host) {
        returnFiber = returnFiber.return
    }
    return returnFiber
}

// 将节点卸载
const unload = (node) => {
    if (node.tag !== Tags.If) {
        throw new Error('Only If Component can be removed.')
    }
    let domParentNode = findDOMParent(node)
    const ref = domParentNode.ref
    // dom remove
    node.children.forEach(c => {
        ref.removeChild(c.ref)
    })
    // 需要解除 ref
    walk(node, (n) => {
        n.ref = null
    })
}

// 在固定位置加载节点
const load = (node, render) => {
    const [p, l, n, r, i] = findDOMLocation(node)
}

const walk = (node, perform) => {
    let current = node
    while (true) {
        perform(current)
        if (current.child === null) {
            if (current.silbing === null) {
                // back to parent
                let stop = false
                while (current.silbing === null) {
                    current = current.return
                    if (current === node) {
                        stop = true
                        break
                    }
                }
                if (stop) {
                    break
                }
                current = current.silbing
            } else {
                current = current.silbing
            }
        } else {
            current = current.child
        }
    }
}

export {
    findDOMLocation,
    findDOMParent,
    unload,
    load
}