import { 
    Component,
    ComAttr
} from '../../packages/core'

@ComAttr({
    template: require('./app.html'),
    key: 'App'
})
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

export {
    App
}