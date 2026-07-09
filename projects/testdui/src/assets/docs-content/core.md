## 概述

`core` 是框架级基础设施层（20 个子模块），涵盖了应用启动阶段通常都需要的能力：鉴权（auth，含登录守卫、拦截器、锁屏）、全局配置（config）、本地存储（storage）、Cookie、颜色工具（color）、加解密（crypt）、动态组件（dynamic）、页面元信息（meta）、MobX 响应式集成（mobx）、媒体查询（media）等。

## 何时使用

大部分 `core` 子模块会在应用的根模块（`AppModule`）里被引入一次并全局提供（例如 `AuthModule`、`ConfigModule`、`LocalStorageModule`），而不是在业务组件里零散引入。如果你在搭建一个新的 DUI 应用骨架，可以从这里的 `auth`、`config`、`storage` 开始。
