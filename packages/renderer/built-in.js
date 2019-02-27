import {
    Component,
} from '../core'

import {
    componentDecorator
} from './decorators'

class IfComponent extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
            value: false
        }
    }
}
componentDecorator('If', IfComponent, null)

class TextComponent extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
            value: ''
        }
    }
}
componentDecorator('Text', TextComponent, null)

class RootComponent extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}
componentDecorator('Root', RootComponent, null)


class SlotComponent extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}
componentDecorator('Slot', SlotComponent, null)

class LoopComponent extends Component {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}
componentDecorator('Loop', LoopComponent, null)

export {
    IfComponent,
    LoopComponent,
    TextComponent,
    SlotComponent,
    RootComponent
}