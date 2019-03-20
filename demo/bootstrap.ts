import {
    render,
    mount
} from '../packages/renderer'
import {
    AppComponent
} from './app'
const app = new AppComponent(null, null)

const fiberRoot = render(app, document.querySelector('#App'))

console.log(fiberRoot)

mount(fiberRoot)