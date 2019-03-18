import { Observable, BehaviorSubject } from 'rxjs'
import { Tree, TreeChild } from './Tree'

abstract class Component {
    public host: Element
    private state: { [key: string]: any }
    protected props: { [key: string]: string }
    protected slots: Array<TreeChild>
    private observable: BehaviorSubject<{ [key: string]: any }>
    constructor(props: { [key: string]: string }, slots: Array<TreeChild>) {
        this.state = {
        }
        this.props = props
        this.slots = slots
        this.observable = new BehaviorSubject(this.state)
    }
    render(): TreeChild | Array<TreeChild> {
        throw new Error('Please implements `render` method or use @Tpl on component.')
    }
}

export {
    Component
}