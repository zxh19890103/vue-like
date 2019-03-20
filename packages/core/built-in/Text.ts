import { Component } from '../Component'
import { Reg } from '../Reg.decorator'
import { TreeChild } from '../Tree'
@Reg('Text')
export class TextComponent extends Component {
    constructor(props: { [key: string]: string }, public slots: Array<TreeChild>) {
        super(props, slots)
    }
    
    render() {
        console.log(this.props)
        // const key = this.props[':value']
        // console.log('>>', this.parent)
        // const value = this.parent[key]
        return String(this.props['value'])
    }
}