import {
    Component,
    Tpl,
    Reg
} from '../packages/core'

@Reg('Sound')
@Tpl(require('./sound.template.html'))
class SoundComponent extends Component {    
}
export {
    SoundComponent
}