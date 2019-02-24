import { dom } from '../../packages/renderer'
import { App } from './app'
import './who'

const app = new App({
})

console.log(app)

dom.render(App.$tpl, document.querySelector('#App'), app)