import { 
    Component,
    ComAttr
} from '../../packages/core'

@ComAttr({
    template: require('./who.html'),
    key: 'Who'
})
export class Who extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}
