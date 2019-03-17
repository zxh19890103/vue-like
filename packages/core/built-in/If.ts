import { Component } from '../Component'
import { Reg } from '../Reg.decorator'

@Reg('If')
export class IfComponent extends Component {
    render() {
        return this.slots
    }
}