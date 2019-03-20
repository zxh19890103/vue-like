import {
    TreeChild, Component
} from '../core'

export interface FiberNode {
    type: number
    stateNode: any
    child: FiberNode
    sibling: FiberNode
    return: FiberNode
}

const createFiberFromTreeChild = (tree: TreeChild) : FiberNode => {
    let type = -1
    if (typeof tree === 'string') type = 0
    else type = tree.type
    return {
        type,
        stateNode: null,
        child: null,
        return: null,
        sibling: null
    }
}

const createFiberRoot = (app: Component, element: Element) : FiberNode => {
    const rootFiber: FiberNode = {
        type: 1,
        stateNode: element,
        child: null,
        return: null,
        sibling: null
    }
    const appFiber: FiberNode = {
        type: 2,
        stateNode: app,
        child: null,
        return: rootFiber,
        sibling: null
    }
    rootFiber.child = appFiber
    return appFiber
}

export {
    createFiberFromTreeChild,
    createFiberRoot
}