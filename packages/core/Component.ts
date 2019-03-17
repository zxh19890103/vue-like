import { Observable, BehaviorSubject } from 'rxjs'
import { Tree, TreeChild } from './Tree'

abstract class Component {
    public host: Element
    private state: { [key: string]: any }
    private observable: BehaviorSubject<{ [key: string]: any }>
    constructor(public props: { [key: string]: string }, public slots: Array<TreeChild>) {
        this.state = {
        }
        this.observable = new BehaviorSubject(this.state)
    }
    render(): TreeChild | Array<TreeChild> {
        throw new Error('Please implements `render` method or use @Tpl on component.')
    }
}

export {
    Component
}