const Tags = {
    // Internally logic
    Text: 'Text',
    Slot: 'Slot',
    Root: 'Root', // only used internally
    // Directives
    If: 'If',
    Loop: 'Loop',
}

const isBuiltInDirective = (tag) => {
    return tag === Tags.If || tag === Tags.Loop
}

export {
    Tags,
    isBuiltInDirective
}