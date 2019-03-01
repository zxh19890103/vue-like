import { 
    Component,
} from '../../packages/core'

import {
    componentDecorator
} from '../../packages/renderer'

class Test extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
            title: 'Hello, World',
        }
    }
}

componentDecorator(
    'Test',
    Test,
    require('./test.html')
)

export {
    Test
}