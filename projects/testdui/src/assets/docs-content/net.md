## 概述

`net` 提供 HTTP 相关的基础设施：全局请求加载指示器（`HttpLoaderModule`/`HttpLoaderComponent`）、请求挂起状态拦截器（`PendingRequestsInterceptor`）、加载动画可见性服务（`SpinnerVisibilityService`）。

## 何时使用

在 `AppModule` 中通过 `HttpLoaderModule.forRoot()` 全局引入一次即可，之后所有 HTTP 请求都会自动驱动全局的加载指示状态，无需在每个业务模块里重复配置。
