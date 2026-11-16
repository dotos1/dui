## 概述

`core`（`@dotos1/dui/core/*`）是应用级核心基础设施层（共 20 个二级入口），涵盖应用启动阶段与跨模块协作所需的核心服务：鉴权与路由守卫（`auth`）、全局配置（`config`）、本地存储（`storage` / `cookie`）、调色板与色彩空间计算（`color`）、对称加解密（`crypt`）、动态组件工厂（`dynamic` / `services`）、动态表单内核（`form`）、MobX 响应式桥接（`mobx`）以及浮动定位计算（`position`）。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos1/dui/core` | `Dui`, `CoreModule`, `SplashScreenService`, `MatchMediaService` | 根级静态注册表 `Dui`、启动屏控制、剪贴板与视口媒体查询服务 |
| `@dotos1/dui/core/auth` | `AuthModule`, `AuthenticationService`, `AuthGuard` | 令牌管理、HTTP 鉴权拦截器、登录态路由守卫与锁屏子模块（`auth/lock`） |
| `@dotos1/dui/core/color` | `Color`, `Palette`, `ColorNames` | Material 色板矩阵、HSL/RGB/Hex 转换与对比度计算 |
| `@dotos1/dui/core/form` | `CoreFormModule`, `FieldConfig`, `FormComponent` | 动态表单底层抽象模型、验证器注册与响应式表单控件绑定 |
| `@dotos1/dui/core/mobx` | `MobxAngularModule`, `MobxAutorunDirective` | Angular 变更检测（`ChangeDetectorRef`）与 MobX `autorun`/`computed` 桥接指令 |
| `@dotos1/dui/core/storage` | `StorageService`, `LocalStorageService`, `MemoryStorageService` | 带命名空间前缀的 `localStorage` 与内存回退存储服务 |

## 架构与设计模式

- **单例服务与 `forRoot` 模式**：`core` 下的服务大多采用 `providedIn: 'root'` 或 `NgModule.forRoot()` 提供全局单例，保证全应用共享同一份鉴权上下文、存储命名空间与动态组件注册表。
- **元数据驱动与动态渲染**：`Dui.registerComponentFactory` 与 `core/dynamic` 共同支撑了 Dotos 平台通过 JSON Schema 动态装配件的能力。

## 典型用法与最佳实践

```typescript
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@dotos1/dui/core/storage';
import { Color } from '@dotos1/dui/core/color';

@Injectable({ providedIn: 'root' })
export class UserPreferenceService {
  constructor(private storage: LocalStorageService) {}

  saveAccentColor(hex: string): void {
    const color = Color.fromString(hex);
    this.storage.setItem('user.accent', color.toRgbString());
  }
}
```
