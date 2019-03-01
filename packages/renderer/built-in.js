import {
    Component,
    HostLikeComponent
} from '../core'

import {
    componentDecorator
} from './decorators'

class IfComponent extends HostLikeComponent {
    constructor(props, children) {
        super(props, children)
        this.$state = {
            value: false
        }
    }
}
componentDecorator('If', IfComponent, null)

class TextComponent extends HostLikeComponent {
    constructor(props, children) {
        super(props, children)
        this.$state = {
            value: ''
        }
    }
}
componentDecorator('Text', TextComponent, null)

class RootComponent extends HostLikeComponent {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}
componentDecorator('Root', RootComponent, null)


class SlotComponent extends HostLikeComponent {
    constructor(props, children) {
        super(props, children)
        this.$state = {
        }
    }
}
componentDecorator('Slot', SlotComponent, null)

class LoopComponent extends HostLikeComponent {
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