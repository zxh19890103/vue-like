import { Component, componentsHub, tplCompile } from '../../packages/core'

class Who extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}

Who.$tpl = tplCompile(require('./who.html'))
componentsHub.register('Who', Who)

export {
    Who
}