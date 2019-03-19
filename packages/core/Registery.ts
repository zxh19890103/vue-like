const map = new Map<string, any>()

const register = (key: string, type: any) => {
    map.set(key, type)
}

const get = (key: string): any => {
    return map.get(key)
}

export {
    register as regComponent,
    get as getComponent
}