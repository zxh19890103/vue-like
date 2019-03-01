import { dom } from '../../packages/renderer'
import { App } from './app'
import { Test } from './test'
import './who'

const app = new Test({
})

dom.render(app, document.querySelector('#App'))

