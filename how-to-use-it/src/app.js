import { 
    Component,
    initComponent
} from '../../packages/core'

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

initComponent(
    'App',
    App,
    require('./app.html')
)

export {
    App
}