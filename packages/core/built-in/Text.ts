import { Component } from '../Component'
import { Reg } from '../Reg.decorator'
import { TreeChild } from '../Tree'
@Reg('Text')
export class TextComponent extends Component {
    constructor(props: { [key: string]: string }, public slots: Array<TreeChild>) {
        super(props, slots)
    }
    
    render() {
        return this.props[':value']
    }
}