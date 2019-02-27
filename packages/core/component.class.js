
class Component {
    constructor(props, children = null) {
        this.$props = props
        this.$chidren = children
        this.$state = {
        }
        this.$con = null
        this.$el = null

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
                    if (binds && binds[key] && this.$con) {
                        const [v, i] = this.$con.get(binds[key])
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

export {
    Component,
}