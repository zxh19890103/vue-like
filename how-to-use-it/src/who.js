import { 
    Component,
    initComponent
} from '../../packages/core'

class Who extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}

initComponent(
    'Who',
    Who,
    require('./who.html')
)

export {
    Who
}