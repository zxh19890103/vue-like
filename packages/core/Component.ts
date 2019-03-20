import { Observable, BehaviorSubject } from 'rxjs'
import { Tree, TreeChild } from './Tree'

abstract class Component {
    public host: Element = null
    protected props: { [key: string]: string } = null
    protected slots: Array<TreeChild> = null
    public observable: BehaviorSubject<{ [key: string]: any }>
    public parent: Component = null
    constructor(props: { [key: string]: string }, slots: Array<TreeChild>) {
        this.props = props
        this.slots = slots
        this.observable = new BehaviorSubject(null)
        // props = { ":key": "keyName" }
        // listen props' changes
        // listen state's changes
    }
    render(): TreeChild | Array<TreeChild> {
        throw new Error('Please implements `render` method or use @Tpl on component.')
    }
    created() {
        if (this.props === null) return
        Object.keys(this.props).forEach(key => {
            if (key.startsWith(':')) {
                const bindKey = this.props[key]
                let value = null
                if (bindKey.startsWith('props.')) {
                    const parentBindKey = bindKey.substr(6)
                    value = this.parent.parent[parentBindKey]
                } else {
                    value = this.parent[bindKey]
                }
                Object.defineProperty(this.props, key.substr(1), {
                    writable: false,
                    configurable: false,
                    value
                })
            }
        })
    }
}

export {
    Component
}