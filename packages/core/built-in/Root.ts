import { Component } from '../Component'
import { Reg } from '../Reg.decorator'

@Reg('Root')
export class RootComponent extends Component {
    render() {
        return this.slots
    }
}