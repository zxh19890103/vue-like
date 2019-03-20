import {
    Component,
    Tpl,
    Reg
} from '../packages/core'

@Reg('Sound')
@Tpl(require('./sound.template.html'))
class SoundComponent extends Component {
    public url: string = 'Hello, world'
}
export {
    SoundComponent
}