import {
    renderComponent
} from '../packages/renderer'
import './app'

const fiberRoot = renderComponent({
    tag: 'App',
    type: 2,
    children: null,
    props: null
})

console.log(fiberRoot)