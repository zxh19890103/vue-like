import {
    FiberNode
} from './fiber'

let currentFiber: FiberNode = null
let nextFiber: FiberNode = null

const mount = (root: FiberNode) => {
    currentFiber = root
    let x = 0, y = 0, z = 0
    while (currentFiber && x < 300) {
        x ++
        // ## Find nextFiber Begin
        // If there is a child, then set currentFiber to the child.
        findNextFiber()
        // ## Find nextFiber End
        // is host element or text node. mount.
        if (currentFiber.type === 1 || currentFiber.type === 0) {
            doMount()
        }
        currentFiber = nextFiber
        nextFiber = null
    }
    console.log(x, y, z)
}

const findNextFiber = () => {
    let z = 0
    if (currentFiber.child !== null) {
        nextFiber = currentFiber.child
        return
    }
    if (currentFiber.sibling !== null) {
        nextFiber = currentFiber.sibling
        return
    }
    nextFiber = currentFiber.return
    while (nextFiber && z < 300) {
        z ++
        if (nextFiber.sibling !== null) {
            nextFiber = nextFiber.sibling
            break
        }
        nextFiber = nextFiber.return
    }
}

const doMount = () => {
    const fiber = currentFiber
    const parentFiber = findParentHostElement(fiber)
    if (parentFiber) {
        const element = parentFiber.stateNode
        element.appendChild(fiber.stateNode)
    }
}

const findParentHostElement = (fiber: FiberNode) => {
    let returnFiber = fiber.return
    while (returnFiber !== null && returnFiber.type !== 1) {
        returnFiber = returnFiber.return
    }
    return returnFiber
}

export {
    mount
}