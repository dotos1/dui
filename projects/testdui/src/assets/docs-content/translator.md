## 概述

`translator`（`@dotos1/dui/translator`）是 DUI 的国际化（i18n）与多语言翻译运行时框架，提供 `TranslateModule`、`TranslateService`、`TranslatePipe`（`| translate`）、`TranslateDirective`，以及面向多模块分片语言包管理的更高层门面服务 `TranslationService`。

## 核心模块与职责

| 导出项 | 类型 | 职责说明 |
| --- | --- | --- |
| `TranslateModule` | NgModule | 提供 `forRoot()` 与 `forChild()`，导出 `TranslatePipe` 与 `TranslateDirective` |
| `TranslationService` | Service | 统一管理应用与各子模块的翻译资源目录（`addTranslationFolder`）、当前语言（`userLang`）与语言切换（`use(lang)`） |
| `TranslateService` | Service | 底层翻译键值解析器、参数插值引擎与缺失键回退处理器 |
| `TranslatePipe` | Pipe (`translate`) | 模板管道，监听语言变更事件并自动刷新绑定文本 |

## 架构与设计模式

- **去中心化多目录合并**：不同业务库或二级入口可通过 `translationService.addTranslationFolder(name, path)` 注册各自的语言目录（如 `i18n/public`、`i18n/dui`），切换语言时由 `TranslationService` 统一并发拉取并合并字典。

## 典型用法与最佳实践

```typescript
import { Component } from '@angular/core';
import { TranslationService } from '@dotos1/dui/translator';

@Component({
  selector: 'app-lang-switcher',
  template: `
    <span>{{ 'NAV.HOME' | translate }}</span>
    <button (click)="switchLang('zh_CN')">中文</button>
    <button (click)="switchLang('en_US')">English</button>
  `,
})
export class LangSwitcherComponent {
  constructor(private translation: TranslationService) {
    this.translation.addTranslationFolder('public', 'i18n');
  }

  switchLang(lang: 'zh_CN' | 'en_US'): void {
    this.translation.use(lang).subscribe();
  }
}
```
