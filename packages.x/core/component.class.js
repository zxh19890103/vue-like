
class Component {
    constructor(props, children = null) {
        this.$props = props
        this.$chidren = children
        this.$state = {
        }
        // parent component
        this.$parentInstance = null
        // the fiber node reference
        this.$fiber = null
        this.__deps__ = []
    }

    get(key) {
        let val = this.$state[key]
        let ins = this
        let keyOnIns = key
        if (val === undefined) {
            ins = null
            if (this.$props) {
                const {
                    attrs,
                    binds
                } = this.$props
                if (attrs && attrs[key]) {
                    val = attrs[key]
                }
                if (val === undefined) {
                    if (binds && binds[key] && this.$parentInstance) {
                        const [v, i] = this.$parentInstance.get(binds[key])
                        val = v
                        if (i) {
                            keyOnIns = binds[key]
                            ins = i
                        }
                    }
                }
            }
        }
        return [val, ins, keyOnIns]
    }

    set(key, value) {
        const oldVal = this.$state[key]
        if (oldVal === value) return
        this.$state[key] = value
        for (let dep of this.__deps__) {
            if (dep.field === key) {
                dep.handler.call(this, value, dep.args)
            }
        }
    }

    watch(field, handler, ...args) {
        this.__deps__.push({
            field,
            handler,
            args
        })
    }

    render() {
        throw new Error('not implemented')
    }

}

class HostLikeComponent extends Component {
    constructor(props, children) {
        super(props, children)
        this.$isHostLike = true
    }
}

export {
    Component,
    HostLikeComponent
}