# vue-like
a vue-like web framework.

# design

## virtual node
```javascript
{
    type: null, // 1 =  host element；2 = 自定义组件
    tag: null, // 标签，对于host element，是 HTML 标签；对于component，是首字母大写自定义标签
    props: null, // 外部输入
    children: null, // 对于host组件 子元素
    slots: null, // 对于自定义组件 的子元素
    ref: null, // host 元素 或者 component 实例 或者 虚拟 组件（if、text、loop等）
    // Fiber
    _return: null,
    child: null,
    sibling: null,
}
```


## how it works

```
We image that every data you can bind to template is from the component's field $state.

Component can receive data from parent by props, and props also can be bound to template.

The data declared as state is reactive by RXJS.

Every update of state will lead to the updates of DOM.

```

### template

We use fast-xml-parser as the parser to parse the HTML user declares to json.
Then we use the json to generate virtual dom by calling component's render method.

### component

A component is a class with it's own state and methods to process state over the lifecycle.