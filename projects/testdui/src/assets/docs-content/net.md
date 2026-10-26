## 概述

`net`（`@dotos/dui/net`）提供 HTTP 网络请求相关的全局基础设施，核心包含全局 HTTP 请求加载进度指示器（`HttpLoaderModule` / `HttpLoaderComponent`）、挂起请求计数拦截器（`PendingRequestsInterceptor`）以及手动控制加载动画显隐的服务（`SpinnerVisibilityService`）。

## 核心模块与职责

| 导出项 | 类型 | 职责说明 |
| --- | --- | --- |
| `HttpLoaderModule` | NgModule | 注册 HTTP 拦截器与顶部/全屏加载指示器组件 |
| `HttpLoaderComponent` | Component (`<http-loader>`) | 监听挂起 HTTP 请求流并自动渲染进度条或旋转指示器 |
| `PendingRequestsInterceptor` | Interceptor | 自动统计当前正在进行的 `HttpClient` 请求数量，支持按 URL 正则过滤排除后台轮询请求 |
| `SpinnerVisibilityService` | Service | 提供 `show()` / `hide()` 命令式接口，允许在非 HTTP 异步任务中手动触发加载器 |

## 架构与设计模式

- **AOP 拦截器自动感知**：通过 Angular `HTTP_INTERCEPTORS` 多重注入机制，业务代码中的 `HttpClient.get/post` 无需编写任何 `loading = true / false` 样板代码即可自动驱动顶部进度条。
- **引用计数防抖**：并发发起多个请求时，只有当所有非忽略请求全部完成（引用计数归零）后才会关闭加载指示器。

## 典型用法与最佳实践

在根模块 `AppModule` 中引入 `HttpLoaderModule.forRoot()`，并在根组件模板中放置 `<http-loader>`：

```typescript
import { HttpClientModule } from '@angular/common/http';
import { HttpLoaderModule } from '@dotos/dui/net';

@NgModule({
  imports: [HttpClientModule, HttpLoaderModule.forRoot()],
})
export class AppModule {}
```

```html
<!-- app.component.html -->
<http-loader [filteredUrlPatterns]="['/api/heartbeat']"></http-loader>
<router-outlet></router-outlet>
```
