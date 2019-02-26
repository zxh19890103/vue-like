import { dom } from '../../packages/renderer'
import { App } from './app'
import './who'

const app = new App({
})

const tpl = app.render()

console.log(tpl)

dom.render(tpl, document.querySelector('#App'), app)