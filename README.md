# @dotos/dui — DotOS UI for Angular 22

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Angular](https://img.shields.io/badge/Angular-%5E22.0.0-dd0031.svg)](https://angular.dev)
[![Secondary Entry Points](https://img.shields.io/badge/Entry%20Points-95%20Modular-success.svg)](#secondary-entry-points-reference--%E5%85%A8%E9%83%A8%E4%BA%8C%E7%BA%A7%E5%AD%90%E5%85%A5%E5%8F%A3%E9%80%9F%E6%9F%A5%E8%A1%A8)

**DotOS UI (`@dotos/dui`)** is an enterprise-grade **Angular 22** native component library and millisecond-level dynamic **Light / Dark / Industrial DarkBlue** theming foundation, open-sourced under the **MIT License**.

**DotOS UI（`@dotos/dui`）** 是面向复杂数据工作台与企业级 Web 应用的 **Angular 22 原生组件库**与**毫秒级亮色 / 暗色 / 工业深蓝（Light / Dark / DarkBlue）动态主题底座**，基于 **MIT 协议**开源发布。

---

## Key Highlights / 核心特性

- **Angular 22 Native & Ivy Partial Compilation / 原生适配 Angular 22**
  Built with Angular Package Format (FESM2022) and explicit `changeDetection` / `NgModule` boundaries—drop directly into Angular 22 Standalone `imports: [...]` or classic `@NgModule` architectures.
  采用标准 Angular Package Format（FESM2022）构建，无缝兼容 Angular 22 Standalone 组件直接导入与传统 `@NgModule` 工程体系。

- **Millisecond Dynamic Theming (`light` / `dark` / `darkblue`) / 毫秒级动态三态换肤**
  Switch between Light, Dark, and Industrial DarkBlue modes plus Material color palettes at runtime via `ThemeService` & `DotosConfigService`—zero page reload and zero stylesheet recompilation.
  内置完整 Material M2 + 自研组件运行时样式合成引擎，通过 `ThemeService` 与 `DotosConfigService` 在线毫秒级切换**浅色（`light`）**、**深色（`dark`）**、**工业深蓝（`darkblue`）**三态模式与任意主辅色板，无需刷新页面或重新编译 CSS。

- **Zero Heavy-Editor Bloat / 零重型编辑器膨胀**
  Cleanly decoupled from heavy rich-text/code/terminal engines (no `monaco-editor`, no `prosemirror-*`, no `xterm`, no `showdown` in the core bundle). Root `@dotos/dui` exports an empty barrel `{}` while **95 independent secondary entry points** guarantee strict bundler tree-shaking.
  核心库彻底剥离 Monaco、ProseMirror、xterm、Showdown 等重型编辑器依赖，仅保留 7 个轻量基础工具包；根入口刻意保持空导出，全部能力拆分为 **95 个独立二级子入口**，消费端按需引入、极致 Tree-shaking。

- **AI-Ready `llms.txt` Built In / 内置 AI 零幻觉索引**
  Ships `@dotos/dui/llms.txt` inside the npm tarball with full entry-point paths, component selectors, and `@Input()/@Output()` signatures for Cursor, Claude Code, and Antigravity agents.
  随 npm 包内置分发结构化 `llms.txt`，完整收录全部子入口路径、组件选择器与输入输出签名，助力 AI 编程代理零幻觉调用。

---

## Installation / 安装指南

```bash
npm install @dotos/dui
```

Ensure standard Angular 22 & utility peer dependencies are installed in your host application / 请确保宿主工程已安装所需的 Angular 22 对等依赖：

```bash
npm install @angular/animations@^22.0.0 @angular/cdk@^22.0.0 @angular/common@^22.0.0 \
  @angular/core@^22.0.0 @angular/forms@^22.0.0 @angular/material@^22.0.0 \
  @angular/platform-browser@^22.0.0 @angular/router@^22.0.0 \
  rxjs@^7.8.0 lodash-es@^4.17.21 mobx@^6.0.0 moment@^2.29.1
```

> **Optional Peer Dependencies / 可选对等依赖**：
> - `@angular/material-moment-adapter@^22.0.0` — Only needed when using Moment-backed date pickers (`@dotos/dui/form/date/moment`). / 仅在使用 Moment 日期适配器时需要。
> - `highlight.js@^11.11.1` — Only needed when using `@dotos/dui/ux/highlight`. / 仅在使用代码高亮模块时需要。

Import the platform SCSS base in your global `src/styles.scss` / 在全局 `src/styles.scss` 中引入平台基础样式：

```scss
@use '@dotos/dui/theming/platform';
```

---

## 5-Minute Quickstart / 5 分钟快速上手

### 1. Dynamic Runtime Theme Switching / 动态换肤（`@dotos/dui/theme`）

```typescript
import { Component } from '@angular/core';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

@Component({
  selector: 'app-theme-bar',
  template: `
    <button (click)="applyTheme('light')">Light / 浅色</button>
    <button (click)="applyTheme('dark')">Dark / 深色</button>
    <button (click)="applyTheme('darkblue')">DarkBlue / 工业深蓝</button>
  `,
})
export class ThemeBarComponent {
  constructor(
    private readonly dotosConfig: DotosConfigService,
    public readonly themeService: ThemeService // Inject once at root to activate runtime CSS injection
  ) {}

  applyTheme(type: 'light' | 'dark' | 'darkblue'): void {
    this.dotosConfig.config = {
      theme: {
        type,
        primary: 'blue-500',
        accent: 'orange-500',
        warn: 'red-500',
      },
    };
  }
}
```

### 2. JSON-Driven Dynamic Form / 配置驱动动态表单（`@dotos/dui/form`）

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
        label: 'Cluster Name / 集群名称',
        required: true,
        wrappers: ['form-field'],
      },
      {
        xtype: 'select-field',
        name: 'region',
        label: 'Region / 可用区',
        wrappers: ['form-field'],
        options: [
          { label: 'cn-north-1', value: 'cn-north-1' },
          { label: 'ap-east-1', value: 'ap-east-1' },
        ],
      },
    ],
  };
}
```

### 3. Alert & Confirm Dialogs / 模态确认与提示弹窗（`@dotos/dui/common/dialogs`）

```typescript
import { Component } from '@angular/core';
import { DialogsModule, DialogService } from '@dotos/dui/common/dialogs';

@Component({
  selector: 'app-release-Trigger',
  imports: [DialogsModule],
  template: `<button (click)="confirmRelease()">Publish / 发布</button>`,
})
export class ReleaseTriggerComponent {
  constructor(private readonly dialogService: DialogService) {}

  confirmRelease(): void {
    this.dialogService
      .openConfirm({
        title: 'Confirm / 操作确认',
        message: 'Are you sure you want to roll out this configuration? / 确认立即下发该配置吗？',
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dialogService.openAlert({
            title: 'Done / 已完成',
            message: 'Configuration applied successfully. / 配置下发成功。',
          });
        }
      });
  }
}
```

### 4. Tree View & Enterprise Data Table / 树形视图与数据表格（`@dotos/dui/tree` & `@dotos/dui/data/datatable`）

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
      name: 'Production Cluster / 生产集群',
      children: [
        { id: 2, name: 'Gateway Nodes / 网关节点' },
        { id: 3, name: 'Worker Nodes / 计算节点' },
      ],
    },
  ];

  columns = [
    { prop: 'node', name: 'Node / 节点' },
    { prop: 'role', name: 'Role / 角色' },
    { prop: 'latency', name: 'Latency (ms) / 延迟' },
  ];

  rows = [
    { node: 'gw-01', role: 'Ingress', latency: 4.2 },
    { node: 'wk-01', role: 'Compute', latency: 1.8 },
  ];
}
```

---

## Secondary Entry-Points Reference / 全部二级子入口速查表

> Always import from specific secondary entry points (`@dotos/dui/<category>/<module>`) rather than the bare root package.
> 请始终从具体的二级子入口（`@dotos/dui/<分类>/<模块>`）按需导入，以获得最佳构建体积。

### `base` — Foundational Event Bus & Base Models / 底层事件发射器与基础抽象模型 (1)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/base` | `addClass`, `AngularEventEmitter`, `attributes`, `Base` (+43) | - |

### `common` — 36 Modular UI Building Blocks & Directives / 36 个高内聚通用 UI 组件、弹层与交互指令 (36)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
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
| `@dotos/dui/common/toastr` | `ToastNoAnimationModule`, `ToastrComponentlessModule`, `ToastrModule`, `Toast` (+6) | `[toast-component]`, `[toastContainer]`, `[toast-component]` |
| `@dotos/dui/common/trigger` | `TriggerPopup` | - |

### `container` — Docking Workbench & Split Layouts / 桌面级停靠布局容器与分栏面板 (3)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/container/dock-layout` | `DockLayoutModule`, `DockLayoutHostComponent`, `DockLayoutComponentService`, `DockLayoutManagerService` | - |
| `@dotos/dui/container` | `CardModule`, `DuiTabsModule`, `ExpansionModule`, `GridsterModule` (+31) | `accordion`, `card`, `[duiLayoutClose]` |
| `@dotos/dui/container/layout` | `DuiLayoutModule`, `DuiPanelComponent`, `LayoutComponent`, `AbstractPanel` (+1) | `dui-panel`, `dui-layout`, `dui-split-area, [dui-split-area]` |

### `core` — Enterprise Core Infrastructure (Auth, Cache, Config, Crypto, Dynamic, Storage) / 企业级核心基础设施 (20)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
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

### `data` — Enterprise Data Table, Card View & Paging / 高性能数据表、卡片视图与分页 (3)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/data/cardview` | `CardViewModule`, `CardViewArrayItemComponent`, `CardViewBoolItemComponent`, `CardViewComponent` (+9) | `dui-card-view-arrayitem`, `dui-card-view-boolitem`, `dui-card-view` |
| `@dotos/dui/data/datatable` | `DatatableModule`, `DataTableBodyCellComponent`, `DataTableBodyComponent`, `DataTableBodyRowComponent` (+28) | `datatable-body-cell`, `datatable-body`, `datatable-body-row` |
| `@dotos/dui/data/paging` | `DuiPagingModule`, `DuiPagingBarComponent` | `dui-paging-bar` |

### `form` — JSON Schema Dynamic Forms & Date/Range Fields / 配置驱动动态表单与日期/区间控件 (8)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/form/card` | `FormCardModule`, `FormCard` | `form-card` |
| `@dotos/dui/form/date` | `DateFieldModule`, `DateFieldComponent` | `date-field` |
| `@dotos/dui/form/date/adapter` | `MatNativeDatetimeModule`, `NativeDatetimeModule`, `NativeDatetimeAdapter` | - |
| `@dotos/dui/form/date/moment` | `MatMomentDatetimeModule`, `MomentDatetimeModule`, `MomentDatetimeAdapter` | - |
| `@dotos/dui/form/date/picker` | `MatDatetimepickerModule`, `MatDatetimepicker`, `MatDatetimepickerCalendar`, `MatDatetimepickerCalendarBody` (+7) | `mat-datetimepicker`, `mat-datetimepicker-calendar`, `[mat-datetimepicker-calendar-body]` |
| `@dotos/dui/form` | `ArrayInputModule`, `CheckBoxFieldModule`, `CheckboxGroupModule`, `ColorFieldModule` (+50) | `array-input-field`, `[duiAutoTrim]`, `checkbox-field` |
| `@dotos/dui/form/range` | `RangeFieldModule`, `DateRangeFieldComponent`, `NumberRangeFieldComponent`, `RangeField` | `date-range-field`, `number-range-field` |
| `@dotos/dui/form/toggle-select` | `ToggleSelectModule`, `ToggleHeaderComponent`, `ToggleSelectComponent`, `ToggleOption` | `toggle-header`, `toggle-option`, `toggle-select` |

### `i18n` — 12 Built-in Locale Bundles / 内置 12 语种国际化词典资源 (1)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/i18n` | `DUI_LOCALE_BUNDLES` | - |

### `net` — HTTP Client Interceptors & Upload/Download / 网络请求封装与传输辅助 (1)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/net` | `HttpLoaderModule`, `HttpLoaderComponent`, `CacheInterceptor`, `ErrorInterceptor` (+7) | `http-loader` |

### `theme` — Runtime Dynamic Theming Engine / 运行时毫秒级动态换肤引擎 (1)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/theme` | `DotosConfigModule`, `DotosConfigService`, `ThemeService` | - |

### `theming` — Platform SCSS Design Tokens & Mixins / 平台级 SCSS 主题令牌与样式混入 (1)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/theming` | `dui-platform-theme` | - |

### `translator` — Runtime Internationalization Service & Pipe / 运行时多语言国际化服务与管道 (1)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/translator` | `TranslateModule`, `FakeMissingTranslationHandler`, `TranslateDefaultParser`, `TranslateFakeCompiler` (+8) | `[translate],[ngx-translate]` |

### `tree` — Virtualized Tree View & Drag-Drop / 虚拟滚动树形控件与节点拖拽 (1)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/tree` | `TreeModule`, `LoadingComponent`, `TreeComponent`, `TreeNodeCheckboxComponent` (+15) | `tree-loading-component`, `[treeAnimateOpen]`, `Tree, tree-root` |

### `ui` — Core Interactive Controls & Menus / 核心交互控件、工具栏与菜单 (7)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/ui/button` | `ButtonModule`, `ToggleButtonModule`, `ButtonComponent`, `ToggleButtonComponent` | `dui-button`, `toggle-button` |
| `@dotos/dui/ui/color-button` | `ColorPickerButtonModule`, `ColorPickerButton` | `colorpicker-button` |
| `@dotos/dui/ui/context-menu` | `ContextMenuModule`, `ContextMenuComponent`, `ContextMenuItemComponent`, `ContextMenuService` (+1) | `dui-context-menu`, `dui-context-menu-item`, `[duiContextMenuOutsideEvent]` |
| `@dotos/dui/ui/menu` | `MenuModule`, `MenuBarComponent`, `MenuItemComponent`, `MenuBase` (+1) | `dui-menu-bar`, `[menu-host]`, `dui-menu-item` |
| `@dotos/dui/ui/speeddial` | `SpeedDialModule`, `ExtSpeedDialComponent`, `FabButtonComponent`, `SpeedDialActionsComponent` (+2) | `speeddial`, `fabbutton`, `speed-dial-actions` |
| `@dotos/dui/ui/toolbar` | `DuiToolbarModule`, `DuiToolbarComponent`, `Fill`, `Separator` (+2) | `dui-toolbar`, `tbfill`, `divider` |
| `@dotos/dui/ui/topbar` | `TopbarModule`, `ToolbarDividerComponent`, `TopbarComponent`, `TopbarTitleComponent` | `dui-topbar-divider`, `dui-topbar`, `dui-topbar-title` |

### `util` — Pipes, Formatting & Binary Utilities / 常用管道、格式化与工具函数 (3)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
| :--- | :--- | :--- |
| `@dotos/dui/util` | `ExtUtilModule`, `ActivityInterceptor`, `ActivityService` | - |
| `@dotos/dui/util/jpeg` | `decode`, `encode` | - |
| `@dotos/dui/util/pipes` | `DuiPipesModule`, `BytesPipe`, `CamelCaseToDashPipe`, `ClonePipe` (+16) | - |

### `ux` — Workbench UX Widgets (Command Palette, Query Builder, Windows, Highlight) / 高阶工作台交互套件 (10)

| Secondary Entry Point / 二级子入口 | Primary Exports / 核心导出 | Selectors / 选择器 |
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
| `@dotos/dui/ux/windows` | `DragAndDropModule`, `ResizerModule`, `ScrollViewModule`, `UtilsModule` (+14) | `[osAppendToBody]`, `[osDraggable]`, `[osFixedToParent]` |

---

## AI Coding Assistant Integration (`llms.txt`) / AI 辅助编程集成

This package includes `node_modules/@dotos/dui/llms.txt` with machine-readable entry-point paths, component selectors, `@Input()/@Output()` types, and idiomatic Angular 22 snippets. Point Cursor, Claude Code, or Antigravity to `node_modules/@dotos/dui/llms.txt` for zero-hallucination code generation.

本包内置分发 `node_modules/@dotos/dui/llms.txt`，可在 Cursor、Claude Code、Antigravity 等 AI 编码工具中直接引用，获取零幻觉的精确组件选择器与属性签名。

---

## Open Source License & Notices / 开源许可证与第三方声明

- **License / 许可证**: Released under the [MIT License](./LICENSE). / 基于 [MIT 许可证](./LICENSE) 开源。
- **Third-Party Notices / 第三方开源声明**: See [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md) for runtime dependency attributions. / 运行时依赖协议声明详见 [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md)。
- **Repository / 代码仓库**: <https://github.com/dotos1/dui>
