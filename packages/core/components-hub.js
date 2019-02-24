const map = {
}

const register = (key, type) => {
    map[key] = type
}

const get = (key) => {
    return map[key] ? map[key] : null
}

export {
    register,
    get
}