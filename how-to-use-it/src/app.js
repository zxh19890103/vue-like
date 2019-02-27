import { 
    Component,
} from '../../packages/core'

import {
    componentDecorator
} from '../../packages/renderer'

class App extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
            title: 'Sh',
            showTitle: true
        }
    }

    handleClick() {
        this.set('title', 'Hello')
    }

    handleChange(evt) {
        this.set('title', evt.target.value)
    }

    toggleShowTitle() {
        const oldValue = this.$state.showTitle
        this.set('showTitle', !oldValue)
    }
}

componentDecorator(
    'App',
    App,
    require('./app.html')
)

export {
    App
}