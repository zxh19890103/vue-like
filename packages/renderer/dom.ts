import {
    FiberNode
} from './fiber'

let currentFiber: FiberNode = null
let nextFiber: FiberNode = null

const mount = (root: FiberNode) => {
    currentFiber = root
    while (true) {
        if (currentFiber === null) break
        while (true) {           
            if (currentFiber.child !== null) {
                nextFiber = currentFiber.child
                break
            }
            if (currentFiber.sibling !== null) {
                nextFiber = currentFiber.sibling
                break
            }
            nextFiber = currentFiber.return
            while (nextFiber) {
                if (nextFiber.sibling !== null) {
                    nextFiber = nextFiber.sibling
                    break
                }
                nextFiber = nextFiber.return
            }
            if (nextFiber === null) break
        }
        if (currentFiber.type === 1 || currentFiber.type === 0) {
            doMount()
        }
        currentFiber = nextFiber
        nextFiber = null
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