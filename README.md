# @dotos/dui — DotOS UI 企业级 Angular 22 组件库与动态主题底座

**简体中文** | **[English](./README.en.md)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/Version-8.0.0-00897b.svg)](./package.json)
[![Angular](https://img.shields.io/badge/Angular-%5E22.0.0-dd0031.svg)](https://angular.dev)
[![Secondary Entry Points](https://img.shields.io/badge/Entry%20Points-95%20Modular-success.svg)](#%E5%85%A8%E9%83%A8-95-%E4%B8%AA%E4%BA%8C%E7%BA%A7%E5%AD%90%E5%85%A5%E5%8F%A3%E9%80%9F%E6%9F%A5%E8%A1%A8)
[![CSP Safe](https://img.shields.io/badge/CSP-Zero%20unsafe--eval-brightgreen.svg)](#%E6%A0%B8%E5%BF%83%E6%9E%B6%E6%9E%84%E4%BC%98%E5%8A%BF)

**DotOS UI（`@dotos/dui`）** 是面向复杂数据工作台、工业互联网与企业级中后台 Web 应用打造的 **纯正 Angular 22 原生 UI 组件库**与**零 JSS 依赖毫秒级三态动态换肤底座**，基于宽松的 **MIT 许可证**开源发布。

作为 **DotOS 前端工程化套件（DotOS Frontend Engineering Suite）** 的开源核心基座，`@dotos/dui` 深度融合原生 `@angular/material` / `@angular/cdk` 22 体系，内置停靠面板布局（Dock Layout）、配置驱动动态表单、树形视图、虚拟滚动数据表与企业级基础设施模块，并通过确定性 AST 门禁与 AI 原生契约文档保障生产级稳定性。

---

## 目录

1. [核心架构优势](#核心架构优势)
2. [DotOS 前端工程化套件矩阵](#dotos-前端工程化套件矩阵)
3. [安装与全局样式/多语言配置](#安装与全局样式多语言配置)
4. [5 分钟快速上手](#5-分钟快速上手)
5. [动态主题与三档紧凑度详解](#动态主题与三档紧凑度详解)
6. [AI 原生研发体验与质量门禁](#ai-原生研发体验与质量门禁)
7. [全部 95 个二级子入口速查表](#全部-95-个二级子入口速查表)
8. [开源许可证与第三方声明](#开源许可证与第三方声明)

---

## 核心架构优势

- **纯正 Angular 22 原生适配（Ivy Partial Compilation）**
  遵循标准 Angular Package Format（FESM2022）与 Ivy `"compilationMode": "partial"` 构建，显式维护 `ChangeDetectionStrategy` 与模块化边界。所有模块同时支持 Angular 22 Standalone 组件 `imports: [...]` 直接引入与传统 `@NgModule` 工程架构无缝混用。

- **零 JSS 依赖、毫秒级三态动态主题与三档密度切换**
  底层静态令牌由 Angular Material 22 官方 M2 Sass API 生成（`@use '@dotos/dui/theming/platform'`），运行时通过内置零第三方 JSS 依赖的样式规则序列化器（`ThemeService` / `serializeThemeRulesToCss`）按严格层叠顺序（`core` → `material-theme` → `component`）挂载与原位更新 `<style>` 节点（刻意不使用 `adoptedStyleSheets`，确保复杂企业级全局样式覆盖顺序 100% 可预期）：
  - **3 种底色模式**：浅色（`light`）、深色（`dark`）、工业深蓝（`darkblue`）；
  - **3 档排版与密度等级**：宽松（`loose`，density `0`）、标准（`normal`，density `-1`）、紧凑（`compact`，density `-2`）；
  - **2 种表单字段外观**：填充（`fill`）与描边（`outline`）。

- **严格 CSP 合规（零 `unsafe-eval`）与纵深 XSS 防护**
  全库 `src/` 彻底清零动态 `Function` 构造器与 `eval` 调用，内置零依赖递归下降安全表达式解析求值器（`safe-expr.ts`）与 AST 访问器解析服务（`@dotos/dui/core/angular2parse`），全链路阻断 `__proto__` / `constructor` / `prototype` 原型链污染与全局对象逃逸，可直接运行在开启严格 `Content-Security-Policy: script-src 'self'` 的金融、政务与工业内网环境；配合基于惰性 `DOMParser` 的 HTML/SVG 净化与安全 URL 管道，消除内联脚本及样式注入隐患。

- **95 个高内聚二级子入口与极致 Tree-Shaking**
  根包 `@dotos/dui` 刻意保持空导出 `{}` 杜绝全量桶文件膨胀；全部能力按职责拆分为 **95 个独立 TypeScript 二级子入口**。核心包彻底剥离重型编辑器捆绑，仅保留 **7 个轻量运行时依赖**（`buffer`、`colornames`、`element-resize-detector`、`fuse.js`、`minimatch-browser`、`perfect-scrollbar`、`tslib`）。

- **内置 12 语种国际化词典与原生 `Intl` 格式化（含 RTL 双向布局）**
  随包提供 **12 套完整语言包**（`zh_CN` 简体中文、`zh_TW` 繁体中文、`en_US` 英语、`ja_JP` 日语、`ko_KR` 韩语、`de_DE` 德语、`fr_FR` 法语、`es_419` 拉美西班牙语、`pt_BR` 巴西葡萄牙语、`ru_RU` 俄语、`ar_SA` 阿拉伯语 RTL、`id_ID` 印度尼西亚语），由 CI 语种门禁强校验键集合对齐与真实翻译覆盖，并采用浏览器原生 `Intl` 完成日期与数字本地化格式化。

- **AI-Native 零幻觉工程底座**
  随 npm 包分发经 TypeScript AST 门禁逐项校验的 [`llms.txt`](./src/llms.txt) 契约索引，结合源码内 **16,900+ 处 `@zh` 中英双语 JSDoc 注释**与 **10+ 道确定性 CI 守卫门禁**，让 Cursor、Claude Code、GitHub Copilot 与 Antigravity 等 AI 编码代理精准获取真实子入口、组件选择器与 `@Input('alias')` / `@Output('alias')` 公开绑定签名。

---

## DotOS 前端工程化套件矩阵

`@dotos/dui` 是 **DotOS 前端工程化套件**的核心开源层，既可独立支撑各类 Angular 22 企业应用，也可与套件内专业引擎无缝协同：

| 套件包名 | 定位与核心职责 | 授权模式 |
| :--- | :--- | :--- |
| **`@dotos/dui`** | **企业级 Angular 22 基础组件库与动态主题底座** — 涵盖 95 个模块化子入口、动态表单、树与数据表、停靠布局容器、三态毫秒级动态换肤与多语言底座 | **MIT 开源许可证** |
| **`@dotos/duix`** | **DotOS Pro 企业高阶扩展组件套件** — 提供超大规模电子表格级数据网格（Grid）、甘特图与排程、富文本编辑器（ProseMirror）、独立 Monaco 代码编辑器模块（`@dotos/duix/ux/monaco-editor`）、Web 终端（xterm）及工业组态工作台扩展 | 商业 / 企业授权 |
| **`@dotos/xdraw`** | **2D GPU / 矢量图形与组态拓扑引擎** — 面向工业 SCADA 组态、架构拓扑图、流程图与高性能矢量绘图的二三维协同渲染引擎 | 商业 / 企业授权 |
| **`@dotos/aioffice`** | **AI 智能办公与企业报表套件** — 集成在线文档、电子表格、复杂中国式 BI 报表设计器与 AI 辅助内容生成套件 | 商业 / 企业授权 |

---

## 安装与全局样式/多语言配置

### 1. 安装核心包与对等依赖

```bash
npm install @dotos/dui
```

请确保宿主 Angular 22 工程已安装标准对等依赖（`peerDependencies`）：

```bash
npm install @angular/animations@^22.0.0 @angular/cdk@^22.0.0 @angular/common@^22.0.0 \
  @angular/core@^22.0.0 @angular/forms@^22.0.0 @angular/material@^22.0.0 \
  @angular/platform-browser@^22.0.0 @angular/router@^22.0.0 \
  rxjs@^7.8.0 lodash-es@^4.17.21 mobx@^6.0.0 moment@^2.29.1
```

> **按需可选对等依赖（Optional Peer Dependencies）**：
> - `@angular/material-moment-adapter@^22.0.0` — 仅在使用 `@dotos/dui/form/date/moment` 日期适配器时需要安装；
> - `highlight.js@^11.11.1` — 仅在使用 `@dotos/dui/ux/highlight` 代码语法高亮组件时需要安装。

### 2. 引入平台 SCSS 主题样式入口

在应用全局样式表（如 `src/styles.scss`）中通过 Sass `@use` 引入平台基础样式与 M2 令牌系统（注：`@dotos/dui/theming/*` 为纯 SCSS 样式入口，请勿在 TypeScript 中 `import`）：

```scss
@use '@dotos/dui/theming/platform';
```

包内同时暴露以下细粒度 SCSS 辅助入口供自定义样式混入使用：
- `@use '@dotos/dui/theming/all-theme';`
- `@use '@dotos/dui/theming/theming';`
- `@use '@dotos/dui/theming/styles/elevation';`

### 3. 配置内置 12 语种静态词典资源

`i18n/dui/*.json` 为静态 JSON 语言资源目录（并非 TypeScript 模块入口）。在宿主项目 `angular.json` 的 `assets` 中添加映射即可按需加载全部 12 个语种词典：

```json
{
  "glob": "**/*",
  "input": "node_modules/@dotos/dui/i18n",
  "output": "/assets/i18n"
}
```

内置语种文件清单：`zh_CN.json`、`zh_TW.json`、`en_US.json`、`ja_JP.json`、`ko_KR.json`、`de_DE.json`、`fr_FR.json`、`es_419.json`、`pt_BR.json`、`ru_RU.json`、`ar_SA.json`、`id_ID.json`。

---

## 5 分钟快速上手

### 1. 毫秒级三态动态换肤（`@dotos/dui/theme`）

```typescript
import { Component } from '@angular/core';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

@Component({
  selector: 'app-theme-bar',
  template: `
    <button (click)="applyTheme('light')">浅色模式 (Light)</button>
    <button (click)="applyTheme('dark')">深色模式 (Dark)</button>
    <button (click)="applyTheme('darkblue')">工业深蓝 (DarkBlue)</button>
  `,
})
export class ThemeBarComponent {
  constructor(
    private readonly dotosConfig: DotosConfigService,
    public readonly themeService: ThemeService // 在根组件注入一次以激活运行时样式表管理
  ) {}

  applyTheme(type: 'light' | 'dark' | 'darkblue'): void {
    this.dotosConfig.config = {
      theme: {
        type,
        primary: 'blue-500',
        accent: 'orange-500',
        warn: 'red-500',
        formType: 'outline',
      },
    };
  }
}
```

### 2. JSON 配置驱动动态表单（`@dotos/dui/form`）

动态表单内置 CSP 安全的表达式引擎，无需 `unsafe-eval` 即可驱动字段显隐联动与禁用控制：

```typescript
import { Component } from '@angular/core';
import { FormModule } from '@dotos/dui/form';

@Component({
  selector: 'app-quick-form',
  imports: [FormModule],
  template: `<dui-form [config]="formConfig"></dui-form>`,
})
export class QuickFormComponent {
  formConfig = {
    items: [
      {
        xtype: 'text-field',
        name: 'clusterName',
        label: '集群名称',
        required: true,
        wrappers: ['form-field'],
      },
      {
        xtype: 'select-field',
        name: 'region',
        label: '部署可用区',
        wrappers: ['form-field'],
        options: [
          { label: '华北一区 (cn-north-1)', value: 'cn-north-1' },
          { label: '亚太东区 (ap-east-1)', value: 'ap-east-1' },
        ],
      },
    ],
  };
}
```

### 3. 模态确认与提示对话框（`@dotos/dui/common/dialogs`）

```typescript
import { Component } from '@angular/core';
import { DialogsModule, DialogService } from '@dotos/dui/common/dialogs';

@Component({
  selector: 'app-release-trigger',
  imports: [DialogsModule],
  template: `<button (click)="confirmRelease()">下发生产配置</button>`,
})
export class ReleaseTriggerComponent {
  constructor(private readonly dialogService: DialogService) {}

  confirmRelease(): void {
    this.dialogService
      .openConfirm({
        title: '操作确认',
        message: '确认立即向生产集群下发最新配置吗？',
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dialogService.openAlert({
            title: '已完成',
            message: '集群配置已成功生效。',
          });
        }
      });
  }
}
```

### 4. 虚拟滚动树形视图与企业级数据表（`@dotos/dui/tree` & `@dotos/dui/data/datatable`）

```typescript
import { Component } from '@angular/core';
import { TreeModule } from '@dotos/dui/tree';
import { DatatableModule } from '@dotos/dui/data/datatable';

@Component({
  selector: 'app-asset-workbench',
  imports: [TreeModule, DatatableModule],
  template: `
    <div style="display:grid; grid-template-columns: 260px 1fr; gap: 16px; height: 360px;">
      <tree-root [nodes]="treeNodes"></tree-root>
      <dui-datatable [rows]="rows" [columns]="columns"></dui-datatable>
    </div>
  `,
})
export class AssetWorkbenchComponent {
  treeNodes = [
    {
      id: 1,
      name: '生产环境核心集群',
      children: [
        { id: 2, name: '边缘网关节点' },
        { id: 3, name: '高性能计算节点' },
      ],
    },
  ];

  columns = [
    { prop: 'node', name: '节点标识' },
    { prop: 'role', name: '节点角色' },
    { prop: 'latency', name: '响应延迟 (ms)' },
  ];

  rows = [
    { node: 'gw-01', role: 'Ingress', latency: 4.2 },
    { node: 'wk-01', role: 'Compute', latency: 1.8 },
  ];
}
```

---

## 动态主题与三档紧凑度详解

`ThemeService`（来自 `@dotos/dui/theme`）支持在运行时以编程方式即时切换调色板、底色模式、排版密度及表单外观，无需刷新页面或重新编译样式：

```typescript
// 直接调用 ThemeService.changeTheme(primary, accent, warn, mode, densityTypography, formType)
themeService.changeTheme(
  'teal-600',   // 主色阶（支持全部 Material 色板，如 'blue-500'、'indigo-600'）
  'orange-800', // 强调色阶
  'red-800',    // 告警色阶
  'darkblue',   // 底色模式：'light' | 'dark' | 'darkblue'
  'compact',    // 密度与字阶档位：'loose' (0) | 'normal' (-1) | 'compact' (-2)
  'outline'     // 表单外观：'fill' | 'outline'
);
```

切换时，`ThemeService` 会同步维护：
1. `document.documentElement` 上的 `data-theme="light|dark|darkblue"` 与 `data-density="loose|normal|compact"` 属性；
2. `document.body` 上的 `dui-density-loose` / `dui-density-normal` / `dui-density-compact` 类名；
3. `<head>` 中按 `data-dui-role="core"` → `data-dui-role="material-theme"` → `data-dui-role="component"` 严格排序的 `<style>` 样式表节点，自定义组件也可通过 `themeService.loadTheme(themeFn)` 注册响应式组件主题。

---

## AI 原生研发体验与质量门禁

### 1. 内置 `llms.txt` 零幻觉契约

安装本包后，`node_modules/@dotos/dui/llms.txt`（亦可直接通过包导出子路径 `@dotos/dui/llms.txt` 解析）提供了面向大语言模型优化的单文件参考手册。在 Cursor、Claude Code、GitHub Copilot 或 Antigravity 中将该文件加入上下文，即可获得经 AST 校验的精确导入路径、指令选择器与输入/输出绑定名。

### 2. 确定性工程质量门禁体系

`@dotos/dui` 在研发与发布流水线中内建全套自动化守卫门禁：

| 门禁命令 | 守卫职责 |
| :--- | :--- |
| `npm run gate:tsc` | 对全部 96 个 `ng-package.json` 入口点（1 根入口 + 95 二级入口）执行完整 TypeScript 类型检查 |
| `npm run gate:any` | 基于 TypeScript Checker 统计显式/隐式 `any`、空对象 `{}` 推断与双重类型断言，执行只降不升棘轮守卫 |
| `npm run gate:jsdoc` | 校验全库 16,900+ 处 `@zh` 双语 JSDoc 参数/返回类型与真实 AST 类型一致，拦截未翻译动词残留 |
| `npm run gate:llms` | 基于 AST 与 `ng-package.json` 校验 `src/llms.txt` 全部 95 个子入口、代码示例可编译性、选择器与公开绑定别名 |
| `npm run gate:i18n` | 校验 12 套语言包键集合严格一致，防止非英语词典误留英文原文 |
| `npm run gate:esm` | 禁止引入 CommonJS `lodash` / `lodash/fp` 路径，保障纯 ESM Tree-shaking |
| `npm run gate:ng22-compat` | 守护 Angular 22 兼容性（禁已废弃符号、禁 JSS 依赖回流、强制 Ivy Partial 编译与 `::ng-deep` 基线棘轮） |
| `npm run gate:style-ref` | 校验 Angular Material 22 样式引用规范 |
| `npm run gate:standalone` | 校验模块声明组件的显式 `standalone: false` 契约一致性 |
| `npm run gate:pkg-deps` | 构建产物零幽灵依赖、零死依赖、零废弃布局库引用检查 |

---

## 全部 95 个二级子入口速查表

> 请始终从具体的二级子入口（`@dotos/dui/<分类>/<模块>`）按需导入，切勿从根包 `@dotos/dui` 导入。

### `base` — 底层事件总线、DOM 净化与安全表达式工具 (1)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/base` | `addClass`, `AngularEventEmitter`, `attributes`, `Base`, `DuiBase` (+42) | - |

### `common` — 36 个高内聚通用 UI 组件、弹层与交互指令 (36)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/common/animations` | `AnimationsModule`, `ToggleDirective` | `[duiToggle]` |
| `@dotos/dui/common/backdrop` | `BackdropModule`, `BackdropComponent` | `dui-backdrop` |
| `@dotos/dui/common/breadcrumbs` | `BreadcrumbsModule`, `BreadcrumbComponent`, `BreadcrumbsComponent` | `dui-breadcrumb, a[dui-breadcrumb]`, `dui-breadcrumbs` |
| `@dotos/dui/common/carousel` | `MatCarouselModule`, `MatCarouselComponent`, `MatCarouselSlideComponent` | `mat-carousel`, `mat-carousel-slide` |
| `@dotos/dui/common/clickout` | `ClickOutsideModule`, `ClickOutsideDirective` | `[clickOutside]` |
| `@dotos/dui/common/clipboard` | `ClipboardModule`, `ClipboardComponent`, `CopyButtonComponent`, `ClipboardService` (+1) | `dui-copy-content-tooltip`, `[dui-clipboard]`, `copy-button` |
| `@dotos/dui/common/collapsible` | `CollapsibleModule`, `CollapsibleComponent`, `CollapseDirective` | `[duiCollapse]`, `dui-collapsible` |
| `@dotos/dui/common/colorpicker/common` | `AlphaModule`, `CheckboardModule`, `ColorWrapModule`, `CoordinatesModule` (+16) | `color-alpha`, `color-checkboard`, `color-wrap` |
| `@dotos/dui/common/colorpicker/components` | `ColorAlphaModule`, `ColorChromeModule`, `ColorCircleModule`, `ColorCompactModule` (+27) | `color-alpha-picker`, `color-chrome`, `color-chrome-fields` |
| `@dotos/dui/common/dialogs` | `DialogsModule`, `AlertDialogComponent`, `ConfirmDialogComponent`, `duiDialogComponent` (+8) | `dui-alert-dialog`, `dui-confirm-dialog`, `[duiDialogActions]` |
| `@dotos/dui/common/directives` | `DuiDirectivesModule`, `DuiIfOnDomDirective` | `[duiIfOnDom]` |
| `@dotos/dui/common/dnd` | `DndModule`, `DndDraggableDirective`, `DndDragImageRefDirective`, `DndDropzoneDirective` (+2) | `[dndDraggable]`, `[dndDragImageRef]`, `[dndDropzone]` |
| `@dotos/dui/common/dragselect` | `DragToSelectModule`, `SelectContainerComponent`, `ShortcutService`, `SelectItemDirective` | `dts-select-container`, `[dtsSelectItem]` |
| `@dotos/dui/common/dynamic` | `ExtensionsModule`, `DynamicExtensionComponent` | `dui-dynamic-component` |
| `@dotos/dui/common/fileupload` | `FileUploadModule`, `FileDropDirective`, `FileSelectDirective` | `[duiFileDrop]`, `[duiFileSelect]` |
| `@dotos/dui/common/icon` | `IconModule`, `IconComponent`, `FontLoaderService`, `IconPickerService` | `dui-icon` |
| `@dotos/dui/common/icon-sprite` | `IconSpriteModule`, `IconSpriteComponent`, `IconSpriteService`, `IconSpriteDirective` | `svg-icon-sprite`, `[svgIconSpriteAttr]` |
| `@dotos/dui/common/iframe` | `IFrameModule`, `IframeComponent`, `SafePipe` | `dui-iframe` |
| `@dotos/dui/common/inline-svg` | `InlineSVGModule`, `InlineSVGComponent`, `InlineSVGService`, `SVGCacheService` (+1) | `inline-svg`, `[inlineSVG]` |
| `@dotos/dui/common/keyboard` | `KeyboardShortcutsModule`, `KeyboardShortcutComponent`, `KeyboardShortcutsComponent`, `KeyboardShortcutsHelpComponent` (+6) | `keyboard-shortcut`, `keyboard-shortcuts`, `[KeyboardShortcuts]` |
| `@dotos/dui/common/loading` | `LoadingModule`, `LoadingComponent`, `LoadingFactory`, `LoadingService` (+1) | `dui-loading`, `[duiLoading]` |
| `@dotos/dui/common/matcolorpicker` | `ColorPickerModule`, `ColorPickerComponent` | `color-picker` |
| `@dotos/dui/common/media` | `MediaModule`, `MediaService`, `MediaToggleDirective` | `[extMediaToggle]` |
| `@dotos/dui/common/message` | `MessageModule`, `MessageComponent`, `MessageContainerDirective` | `dui-message`, `[duiMessageContainer]` |
| `@dotos/dui/common/notifications` | `NotificationsModule`, `NotificationCountComponent` | `dui-notification-count` |
| `@dotos/dui/common/password` | `TogglePasswordModule`, `TogglePasswordComponent` | `toggle-password` |
| `@dotos/dui/common/perfect-scrollbar` | `PerfectScrollbarModule`, `PerfectScrollbarComponent`, `ForceNativeScrollDirective`, `PerfectScrollbarDirective` | `[forceNativeScrolling]`, `perfect-scrollbar`, `[perfectScrollbar]` |
| `@dotos/dui/common/popover` | `PopoverModule`, `Popover`, `PopoverTarget`, `PopoverTrigger` | `popover`, `popover-target, [popoverTarget]`, `[popoverTriggerFor]` |
| `@dotos/dui/common/print` | `PrintModule`, `PrintService`, `PrintDirective` | `button[duiPrint]` |
| `@dotos/dui/common/resize-element` | `ResizableModule`, `ResizableDirective`, `ResizeHandleDirective` | `[duiResizable]`, `[duiResizeHandle]` |
| `@dotos/dui/common/screenfull` | `ScreenfullService` | - |
| `@dotos/dui/common/scrollbar` | `NgScrollbarModule`, `NgScrollbar`, `NgScrollbarExt`, `AsyncDetection` (+2) | `ng-scrollbar[externalViewport][asyncDetection]`, `ng-scrollbar:not([externalViewport])`, `ng-scrollbar[externalViewport]` |
| `@dotos/dui/common/search-box` | `SearchBoxModule`, `SearchBoxComponent`, `SearchInputComponent` | `search-box`, `search-input` |
| `@dotos/dui/common/stop-propagation` | `StopPropagationModule`, `StopDropPropagationDirective`, `StopPropagationDirective` | `[duiStopDropPropagation]`, `[duiStopPropagation]` |
| `@dotos/dui/common/toastr` | `ToastNoAnimationModule`, `ToastrComponentlessModule`, `ToastrModule`, `Toast` (+6) | `[toast-component]`, `[toastContainer]` |
| `@dotos/dui/common/trigger` | `TriggerPopup` | - |

### `container` — 桌面级多标签停靠布局容器、网格画布与分栏面板 (3)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/container/dock-layout` | `DockLayoutModule`, `DockLayoutHostComponent`, `DockLayoutComponentService`, `DockLayoutManagerService` | `dock-layout-host` |
| `@dotos/dui/container` | `CardModule`, `DuiTabsModule`, `ExpansionModule`, `GridsterModule` (+31) | `accordion`, `card`, `[duiLayoutClose]` |
| `@dotos/dui/container/layout` | `DuiLayoutModule`, `DuiPanelComponent`, `LayoutComponent`, `AbstractPanel` (+1) | `dui-panel`, `dui-layout`, `dui-split-area, [dui-split-area]` |

### `core` — 企业级核心基础设施（鉴权、缓存、配置、加密、动态组件、MobX、存储） (20)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/core/angular2parse` | `Angular2ParseModule`, `Parse` | - |
| `@dotos/dui/core/animation` | `AnimationCurves`, `AnimationDurations` | - |
| `@dotos/dui/core/auth` | `AuthModule`, `AuthBearerInterceptor`, `AuthenticatedGuard`, `AuthGuard` (+6) | - |
| `@dotos/dui/core/auth/lock` | `LockscreenSaverModule`, `LockscreenDialog` | `lock-dialog` |
| `@dotos/dui/core/behaviors` | `ICanDisable`, `ICanDisableRipple`, `IControlValueAccessor`, `IHasChangeDetectorRef` (+3) | - |
| `@dotos/dui/core/cache` | `BaseObject`, `Collection`, `CollectionEventEmitter`, `CollectionEventListener` (+3) | - |
| `@dotos/dui/core/color` | `bound01`, `boundAlpha`, `bounds`, `clamp01` (+49) | - |
| `@dotos/dui/core/config` | `ConfigModule`, `ConfigService`, `FeatureService`, `FeatureDirective` (+1) | `[duiFeature]` |
| `@dotos/dui/core/cookie` | `Cookie`, `CookieSerializer`, `CookieStorage` | - |
| `@dotos/dui/core/crypt` | `encrypt` | - |
| `@dotos/dui/core/decorators` | `coerceArray`, `coerceBoolean`, `coerceCssPixelValue`, `coerceNumber` (+2) | - |
| `@dotos/dui/core/dynamic` | `DynamicModule`, `DynamicComponent`, `SafeurlPipe` | `dui-dynamic` |
| `@dotos/dui/core/form` | `AbstractFormModule`, `FormTemplateType`, `ValidationMessage`, `FormBuilder` (+3) | `form-template`, `validation-message` |
| `@dotos/dui/core` | `RtlModule`, `StyleModule`, `FocusOriginMonitor`, `MediaService` (+5) | `[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]`, `[dir]` |
| `@dotos/dui/core/media` | `MediaService` | - |
| `@dotos/dui/core/meta` | `MetaModule`, `MetaGuard`, `MetaService` | - |
| `@dotos/dui/core/mobx` | `MobxAngularModule`, `MobxAutorunDirective`, `MobxReactionDirective` | `[mobxAutorun]`, `[mobxReaction]` |
| `@dotos/dui/core/position` | `PositionStore` | - |
| `@dotos/dui/core/services` | `CommonServicesModule`, `CookieService`, `HighlightTransformService`, `LogService` (+2) | - |
| `@dotos/dui/core/storage` | `LocalStorageModule`, `LocalStorageService` | - |

### `data` — 高性能虚拟滚动数据表、卡片详情视图与分页栏 (3)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/data/cardview` | `CardViewModule`, `CardViewArrayItemComponent`, `CardViewBoolItemComponent`, `CardViewComponent` (+9) | `dui-card-view-arrayitem`, `dui-card-view-boolitem`, `dui-card-view` |
| `@dotos/dui/data/datatable` | `DatatableModule`, `DataTableBodyCellComponent`, `DataTableBodyComponent`, `DataTableBodyRowComponent` (+28) | `datatable-body-cell`, `datatable-body`, `datatable-body-row`, `dui-datatable` |
| `@dotos/dui/data/paging` | `DuiPagingModule`, `DuiPagingBarComponent` | `dui-paging-bar` |

### `form` — JSON Schema 动态表单与日期时间/区间控件 (8)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/form/card` | `FormCardModule`, `FormCard` | `form-card` |
| `@dotos/dui/form/date` | `DateFieldModule`, `DateFieldComponent` | `date-field` |
| `@dotos/dui/form/date/adapter` | `MatNativeDatetimeModule`, `NativeDatetimeModule`, `NativeDatetimeAdapter` | - |
| `@dotos/dui/form/date/moment` | `MatMomentDatetimeModule`, `MomentDatetimeModule`, `MomentDatetimeAdapter` | - |
| `@dotos/dui/form/date/picker` | `MatDatetimepickerModule`, `MatDatetimepicker`, `MatDatetimepickerCalendar`, `MatDatetimepickerCalendarBody` (+7) | `mat-datetimepicker`, `mat-datetimepicker-calendar`, `[mat-datetimepicker-calendar-body]` |
| `@dotos/dui/form` | `ArrayInputModule`, `CheckBoxFieldModule`, `CheckboxGroupModule`, `ColorFieldModule` (+50) | `array-input-field`, `[duiAutoTrim]`, `checkbox-field`, `dui-form` |
| `@dotos/dui/form/range` | `RangeFieldModule`, `DateRangeFieldComponent`, `NumberRangeFieldComponent`, `RangeField` | `date-range-field`, `number-range-field` |
| `@dotos/dui/form/toggle-select` | `ToggleSelectModule`, `ToggleHeaderComponent`, `ToggleSelectComponent`, `ToggleOption` | `toggle-header`, `toggle-option`, `toggle-select` |

### `net` — HTTP 拦截器链与全局请求加载指示器 (1)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/net` | `HttpLoaderModule`, `HttpLoaderComponent`, `CacheInterceptor`, `ErrorInterceptor` (+7) | `http-loader` |

### `theme` — 运行时毫秒级三态动态换肤引擎 (1)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/theme` | `DotosConfigModule`, `DotosConfigService`, `ThemeService` | - |

### `translator` — 运行时多语言国际化服务、管道与原生 `Intl` 桥接 (1)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/translator` | `TranslateModule`, `FakeMissingTranslationHandler`, `TranslateDefaultParser`, `TranslateFakeCompiler` (+8) | `[translate],[ngx-translate]` |

### `tree` — 虚拟滚动树形控件与节点拖拽排序 (1)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/tree` | `TreeModule`, `LoadingComponent`, `TreeComponent`, `TreeNodeCheckboxComponent` (+15) | `tree-loading-component`, `[treeAnimateOpen]`, `Tree, tree-root` |

### `ui` — 核心交互按钮、右键菜单、工具栏与顶栏 (7)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/ui/button` | `ButtonModule`, `ToggleButtonModule`, `ButtonComponent`, `ToggleButtonComponent` | `dui-button`, `toggle-button` |
| `@dotos/dui/ui/color-button` | `ColorPickerButtonModule`, `ColorPickerButton` | `colorpicker-button` |
| `@dotos/dui/ui/context-menu` | `ContextMenuModule`, `ContextMenuComponent`, `ContextMenuItemComponent`, `ContextMenuService` (+1) | `dui-context-menu`, `dui-context-menu-item`, `[duiContextMenuOutsideEvent]` |
| `@dotos/dui/ui/menu` | `MenuModule`, `MenuBarComponent`, `MenuItemComponent`, `MenuBase` (+1) | `dui-menu-bar`, `[menu-host]`, `dui-menu-item` |
| `@dotos/dui/ui/speeddial` | `SpeedDialModule`, `ExtSpeedDialComponent`, `FabButtonComponent`, `SpeedDialActionsComponent` (+2) | `speeddial`, `fabbutton`, `speed-dial-actions` |
| `@dotos/dui/ui/toolbar` | `DuiToolbarModule`, `DuiToolbarComponent`, `Fill`, `Separator` (+2) | `dui-toolbar`, `tbfill`, `divider` |
| `@dotos/dui/ui/topbar` | `TopbarModule`, `ToolbarDividerComponent`, `TopbarComponent`, `TopbarTitleComponent` | `dui-topbar-divider`, `dui-topbar`, `dui-topbar-title` |

### `util` — 活动监测、JPEG 编解码与 19 个常用安全/格式化管道 (3)

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/util` | `ExtUtilModule`, `ActivityInterceptor`, `ActivityService` | - |
| `@dotos/dui/util/jpeg` | `decode`, `encode` | - |
| `@dotos/dui/util/pipes` | `DuiPipesModule`, `BytesPipe`, `CamelCaseToDashPipe`, `ClonePipe` (+16) | - |

### `ux` — 高阶工作台交互套件（命令面板、规则构建器、多窗口、桌面级浮窗、代码高亮） (10)

> **关于 `@dotos/dui/ux` 中 `ExtCodeEditorComponent`（`td-code-editor`）的说明**：本包不捆绑 `monaco-editor` 体积；当宿主页面已全局加载 `window.monaco` 时，`td-code-editor` 会动态挂载到全局实例。如需完整的独立 Monaco 编辑器集成模块（`MonacoEditorModule`），请使用扩展套件中的 `@dotos/duix/ux/monaco-editor`。

| 二级子入口 | 核心导出 | 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/ux/avatar` | `AvatarModule`, `AvatarComponent`, `AvatarService` | `dui-avatar` |
| `@dotos/dui/ux/command-palette` | `CommandPaletteModule`, `CommandPaletteComponent`, `CommandPaletteContentComponent`, `CommandPaletteHeaderComponent` (+4) | `command-palette`, `command-palette-content`, `command-palette-header` |
| `@dotos/dui/ux/highlight` | `HighlightModule`, `CopyCodeButtonComponent`, `HighlightComponent` | `copy-code-button`, `dui-highlight` |
| `@dotos/dui/ux/iconpicker` | `IconPickerModule`, `IconPickerField` | `icon-picker-field` |
| `@dotos/dui/ux` | `CodeEditorModule`, `ExtUxModule`, `IconPickerModule`, `ExtCodeEditorComponent` (+1) | `td-code-editor`, `icon-picker-field` |
| `@dotos/dui/ux/line-style` | `LineStyleModule`, `LineSizeSelector`, `LineStyleSelector` | `line-size-field`, `line-style-field` |
| `@dotos/dui/ux/link-preview` | `LinkPreviewModule`, `LinkPreviewComponent`, `LinkPreviewCacheService` | `link-preview` |
| `@dotos/dui/ux/multi-window` | `MultiWindowModule`, `MultiWindowRef`, `MultiWindowService`, `WStorageService` | - |
| `@dotos/dui/ux/query-builder` | `QueryBuilderModule`, `QueryBuilderComponent`, `QueryArrowIconDirective`, `QueryButtonGroupDirective` (+7) | `[queryArrowIcon]`, `query-builder`, `[queryButtonGroup]` |
| `@dotos/dui/ux/windows` | `DragAndDropModule`, `ResizerModule`, `ScrollViewModule`, `UtilsModule` (+14) | `[osAppendToBody]`, `[osDraggable]`, `[osFixedToParent]`, `[osResizable]` |

---

## 开源许可证与第三方声明

- **开源协议**：本项目基于 [MIT License](./LICENSE) 开源发布，由北京商典信息科技有限公司（Beijing Shangdian Information Technology Co., Ltd.）研发与维护。
- **第三方开源软件声明**：直接运行时依赖、宿主对等依赖及源码内适配组件的版权署名与标准许可证全文详见 [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md)。
- **版本发布与工程验证指南**：详见 [RELEASE_GUIDE.md](./RELEASE_GUIDE.md)。
- **代码仓库与问题反馈**：<https://github.com/dotos1/dui>
