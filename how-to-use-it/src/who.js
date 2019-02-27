import { 
    Component
} from '../../packages/core'

import {
    componentDecorator
} from '../../packages/renderer'

class Who extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}

componentDecorator(
    'Who',
    Who,
    require('./who.html')
)

export {
    Who
}