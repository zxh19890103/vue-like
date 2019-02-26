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

## flow

1. 用 fast-xml-parser 对 html 组件模板进行解析，生成虚拟节点数据对象（树结构，冻结）
2. 组件的 render 方法返回此数据对象的副本（循环引用）

## 依赖

```json

{
    
}

```
