const EMPTY = ' '
const LT = '<'
const GT = '>'
const SLASH = '/'

const flags = {
    // <AZaz
    BEGIN_OF_TAG: 1,
    // </
    CLOSE_OF_TAG: 2,
    // * not 1 nor 2
    TEXT: 3,
    // />
    SELF_CLOSE_OF_TAG: 4,
    // > without slash before
    END_OF_TAG: 5,
    // space or new-line or tab
    END_OF_TAG_NAME: 6
}

module.exports = {
    EMPTY,
    GT,
    LT,
    SLASH,
    flags
}