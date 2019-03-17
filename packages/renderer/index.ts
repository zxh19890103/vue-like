import {
    getComponent,
    Tree,
    TreeChild
} from '../core'

interface Fiber {
    tree: TreeChild,
    stateNode: any
    child: Fiber
    sibling: Fiber
    return: Fiber
}

const renderComponent = (tree: Tree) => {
    const fiber = createFiberFromTreeChild(tree)
    const ctor = getComponent(tree.tag)
    const instance = new ctor(tree.props, tree.children)
    fiber.stateNode = instance
    const subTree = instance.render()
    if (typeof subTree === 'string') {
        renderString(subTree)
    } else if (subTree instanceof Array) {
        renderChildren(subTree, fiber)
    } else if (subTree === null) {
    } else {
        renderChildren(subTree.children, fiber)
    }
    return fiber
}

const renderHost = (tree: Tree) => {
    const fiber = createFiberFromTreeChild(tree)
    const element = document.createElement(tree.tag)
    fiber.stateNode = element
    renderChildren(tree.children, fiber)
    return fiber
}

const renderChildren = (children: Array<TreeChild>, fiber: Fiber) => {
    if (children === null) return
    fiber.child = children.map(child => {
        if (typeof child === 'string') {
            return renderString(child)
        } else {
            switch (child.type) {
                case 1:
                    return renderHost(child)
                case 2:
                case 3:
                    return renderComponent(child)
                default:
                    throw new Error('Type only 1,2,3 are allowed.')
            }
        }
    }).reduceRight((prev, curr) => {
        curr.sibling = prev
        curr.return = fiber
        return curr
    }, null)
}

const renderString = (str: string) => {
    const fiber = createFiberFromTreeChild(str)
    fiber.stateNode = document.createTextNode(str)
    return fiber
}

const createFiberFromTreeChild = (tree: TreeChild) : Fiber => {
    return {
        tree,
        stateNode: null,
        child: null,
        return: null,
        sibling: null
    }
}

export {
    renderComponent
}