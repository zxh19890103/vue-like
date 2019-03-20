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
    const fiberRoot = createFiberRoot(app, hostElement)
    const tree = app.render() as Tree
    renderChildren(tree.children, fiberRoot, app)
    // connect component instances
    return fiberRoot
}

const renderComponent = (tree: Tree, parent: Component) => {
    const fiber = createFiberFromTreeChild(tree)
    const ctor = getComponent(tree.tag)
    const instance = new ctor(tree.props, tree.children) as Component
    console.log(instance)
    instance.parent = parent
    fiber.stateNode = instance
    const subTree = instance.render()
    if (typeof subTree === 'string') {
        const child = renderString(subTree)
        fiber.child = child
        child.return = fiber
    } else if (subTree instanceof Array) {
        renderChildren(subTree, fiber, instance)
    } else if (subTree === null) {
    } else {
        renderChildren(subTree.children, fiber, instance)
    }
    return fiber
}

const renderHost = (tree: Tree, parentComponent: Component) => {
    const fiber = createFiberFromTreeChild(tree)
    const element = document.createElement(tree.tag)
    fiber.stateNode = element
    renderChildren(tree.children, fiber, parentComponent)
    return fiber
}

const renderChildren = (children: Array<TreeChild>, fiber: FiberNode, parent: Component) => {
    if (children === null) return
    fiber.child = children.map(child => {
        if (typeof child === 'string') {
            return renderString(child)
        } else {
            switch (child.type) {
                case 1:
                    return renderHost(child, parent)
                case 2:
                case 3:
                    return renderComponent(child, parent)
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