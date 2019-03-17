export const Tpl = (tplStr: string) => {
    return (constructor: Function) => {
        // console.log(constructor.prototype.constructor === constructor)
        Object.defineProperty(constructor.prototype, 'render', {
            configurable: false,
            writable: false,   
            value: function() {
                return JSON.parse(tplStr)
            }
        })
    }
}