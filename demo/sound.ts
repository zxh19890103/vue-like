import {
    Component,
    Tpl,
    Reg
} from '../packages/core'

@Reg('Sound')
class SoundComponent extends Component {
    render() {
        return this.slots
    }
}
export {
    SoundComponent
}