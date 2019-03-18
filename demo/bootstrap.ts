import {
    render,
    mount
} from '../packages/renderer'
import {
    AppComponent
} from './app'

const fiberRoot = render(new AppComponent(null, null), document.querySelector('#App'))

console.log(fiberRoot)

mount(fiberRoot)