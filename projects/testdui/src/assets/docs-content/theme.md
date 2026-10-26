## 概述

`theme`（`@dotos/dui/theme`）是 DUI 的运行时动态主题与设计令牌（Design Tokens）引擎。它基于 **JSS（CSS-in-JS）** 在浏览器运行时动态计算并注入组件样式表，无需重新编译 SCSS 即可毫秒级切换主色（Primary）、辅助色（Accent）、警示色（Warn）、明暗模式（`light` / `dark` / `darkblue`）以及表单外观密度。

## 核心模块与职责

| 导出项 | 类型 | 职责说明 |
| --- | --- | --- |
| `DotosConfigModule` | NgModule | 提供 `DotosConfigModule.forRoot(dotosConfig)`，初始化全局默认主题与布局配置 |
| `DotosConfigService` | Service | 响应式管理全局配置（`config: Observable<any>`），支持局部更新与一键重置默认（`resetToDefaults()`） |
| `ThemeService` | Service | 基于 JSS 引擎生成并挂载 Material + DUI 全量组件的动态样式表，提供 `changeTheme(...)` |
| `dotosConfig` | Constant | 默认主题配置常量（默认 `type: 'light'`, `primary: 'blue-500'`, `accent: 'orange-500'`, `warn: 'red-800'`） |

## 架构与设计模式

- **JSS 动态样式合成**：`@dotos/dui/theme` 内部为每一个 Angular Material 控件与 DUI 扩展控件维护了函数式主题产生器（如 `duiButtonTheme`、`duiDatatableTheme`），当色板或明暗模式变更时，仅重算色阶变量并更新 `<style>` 节点。
- **响应式配置流**：通过 `DotosConfigService.config`（`BehaviorSubject`），应用内任何组件均可实时订阅当前主题状态（记得配合 `takeUntil(this.destroy$)` 在 `ngOnDestroy` 中退订）。

## 典型用法与最佳实践

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private dotosConfig: DotosConfigService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.dotosConfig.config.pipe(takeUntil(this.destroy$)).subscribe((cfg) => {
      const { primary, accent, warn, type } = cfg.theme;
      this.themeService.changeTheme(primary, accent, warn, type);
    });
  }

  switchToDarkMode(): void {
    this.dotosConfig.config = {
      theme: { type: 'dark', primary: 'blue-500', accent: 'orange-500', warn: 'red-800' },
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```
