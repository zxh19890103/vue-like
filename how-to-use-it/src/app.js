import { Component, componentsHub, tplCompile } from '../../packages/core'

class App extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
            title: 'Sh'
        }
    }

    handleClick() {
        this.set('title', 'Hello')
    }

    handleChange(evt) {
        this.set('title', evt.target.value)
    }
}

App.$tpl = tplCompile(require('./app.html'))
componentsHub.register('App', App)

export {
    App
}