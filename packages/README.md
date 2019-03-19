## 基于Fiber结构和RXjs的类Vue框架

### compiler 会将HTML模板转换为JS对象表达，搭配webpack，写了一个loader

### core 基础类定义

### renderer 根据 compiler 生成的json表达，递归地生成Fiber结构（类似React的Fiber设计），并创建实例（组件、DOM），然后挂载至页面