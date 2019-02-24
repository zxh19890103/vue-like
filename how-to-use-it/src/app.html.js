export default [
    {
        tag: 'h3',
        children: [
            {
                tag: 'Text',
                props: {
                    value: '{{title}}'
                }
            }
        ]
    },
    {
        tag: 'div',
        children: [
            {
                tag: 'p',
                children: [
                    {
                        tag: 'Text',
                        props: {
                            value: 'This is a Vue-like web framework.'
                        },
                        attrs: {}
                    },
                    {
                        tag: 'a',
                        attrs: {
                            href: 'javascript:void(0);',
                            '@click': 'handleClick'
                        },
                        children: [
                            {
                                tag: 'Text',
                                props: {
                                    value: 'Hit here'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag: 'Who',
                props: {
                    name: 'Singhi'
                }
            }
        ]
    }
]