import { compileHtml, fiberRender } from './compiler'
import * as registery from './registery'

const componentDecorator = (key, Component, tpl) => {
    let compiledTpl = null
    if (tpl) {
        compiledTpl = compileHtml(tpl) // only once
    }
    Object.defineProperty(Component.prototype, 'render', {
        value: function() {
            if (compiledTpl)
                return fiberRender(compiledTpl)
            else
                return null
        },
        configurable: false,
        writable: false
    })
    registery.register(key, Component)
}

export {
    componentDecorator
}