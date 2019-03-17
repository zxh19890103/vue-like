import {
    Component,
    Tpl,
    Reg
} from '../packages/core'

import './sound'

@Reg('App')
@Tpl(require('./app.template.html'))
class AppComponent extends Component {
    public url: string = 'http://www.google.com/sound.mp3'
}
export {
    AppComponent
}