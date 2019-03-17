import {
    regComponent
} from './Registery'

export const Reg = (key: string) => {
    return (constructor: any) => {
        regComponent(key, constructor)
    }
}