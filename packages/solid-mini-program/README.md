# solid-mini-program

SolidJS 示例微信小程序

## 页面

### [l1-dynamic-template](./src/pages/l1-dynamic-template/index.tsx)

第一层, 使用动态模板渲染页面, 模板结构与 Taro 相同

### [l2-vdom-to-template-data](./src/pages/l2-vdom-to-template-data/index.tsx)

第二层, 使用虚拟 DOM 并将节点树映射为动态模板数据

### [l3-0-solid-on-vdom](./src/pages/l3-0-solid-on-vdom/index.tsx)

第三层, 实现 1, 使用在虚拟 DOM 之上的通用渲染器以渲染 SolidJS

### [l3-1-solid-on-taro-runtime](./src/pages/l3-1-solid-on-taro-runtime/index.tsx)

第三层, 实现 2, 使用`@tarojs/runtime`提供的 DOM 和 BOM 接口原生集成 SolidJS

与实现 1 不同, 此方法无需配置`babel-preset-solid`生成适配第三方 SolidJS 渲染器的 JSX 代码, 而是直接生成使用浏览器 DOM 和 BOM 接口的 JSX 代码
