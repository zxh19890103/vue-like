import {
    getComponent,
    Tree,
    TreeChild,
    Component
} from '../core'

import {
    FiberNode,
    createFiberFromTreeChild,
    createFiberRoot
} from './fiber'

const render = (app: Component, hostElement: Element) => {
    const fiberRoot = createFiberRoot(hostElement)
    const tree = app.render() as Tree
    renderChildren(tree.children, fiberRoot)
    return fiberRoot
}

const renderComponent = (tree: Tree) => {
    console.log(tree)
    const fiber = createFiberFromTreeChild(tree)
    const ctor = getComponent(tree.tag)
    const instance = new ctor(tree.props, tree.children)
    console.log(instance)
    fiber.stateNode = instance
    const subTree = instance.render()
    if (typeof subTree === 'string') {
        const child = renderString(subTree)
        fiber.child = child
        child.return = fiber
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

const renderChildren = (children: Array<TreeChild>, fiber: FiberNode) => {
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

export {
    render
}

export * from './dom'