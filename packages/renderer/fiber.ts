import {
    TreeChild
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

const createFiberRoot = (element: Element) : FiberNode => {
    return {
        type: 1,
        stateNode: element,
        child: null,
        return: null,
        sibling: null
    }
}

export {
    createFiberFromTreeChild,
    createFiberRoot
}