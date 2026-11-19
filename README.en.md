# @dotos/dui — Enterprise Angular 22 UI Component & Dynamic Theming Foundation

**[简体中文](./README.md)** | **English**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/Version-8.0.0-00897b.svg)](./package.json)
[![Angular](https://img.shields.io/badge/Angular-%5E22.0.0-dd0031.svg)](https://angular.dev)
[![Secondary Entry Points](https://img.shields.io/badge/Entry%20Points-95%20Modular-success.svg)](#all-95-secondary-entry-points-reference)
[![CSP Safe](https://img.shields.io/badge/CSP-Zero%20unsafe--eval-brightgreen.svg)](#core-architectural-highlights)

**DotOS UI (`@dotos/dui`)** is a **pure Angular 22 native UI component library** and **zero-JSS millisecond-level 3-state dynamic theming foundation** built for complex data workbenches, industrial IoT platforms, and enterprise web applications, released under the permissive **MIT License**.

As the open-source foundation of the **DotOS Frontend Engineering Suite**, `@dotos/dui` builds directly on native `@angular/material` and `@angular/cdk` 22, delivering multi-tab dockable workbench layouts, JSON-schema dynamic forms, virtualized trees, enterprise data tables, and core application infrastructure—backed by deterministic AST CI gates and an AI-native contract reference.

---

## Table of Contents

1. [Core Architectural Highlights](#core-architectural-highlights)
2. [DotOS Frontend Engineering Suite](#dotos-frontend-engineering-suite)
3. [Installation, Global SCSS & i18n Setup](#installation-global-scss--i18n-setup)
4. [5-Minute Quickstart](#5-minute-quickstart)
5. [Dynamic Theming & 3-Tier Density Guide](#dynamic-theming--3-tier-density-guide)
6. [AI-Native Developer Experience & Quality Gates](#ai-native-developer-experience--quality-gates)
7. [All 95 Secondary Entry Points Reference](#all-95-secondary-entry-points-reference)
8. [Open Source License & Third-Party Notices](#open-source-license--third-party-notices)

---

## Core Architectural Highlights

- **Pure Angular 22 Native & Ivy Partial Compilation**
  Built in Angular Package Format (FESM2022) with Ivy `"compilationMode": "partial"` and explicit `ChangeDetectionStrategy` and `@NgModule` boundaries. Every module can be imported directly into Angular 22 Standalone Component `imports: [...]` arrays or traditional `@NgModule` enterprise applications.

- **Zero-JSS Millisecond 3-State Dynamic Theming & 3 Density Scales**
  Static baseline tokens are generated from Angular Material 22's official M2 Sass API (`@use '@dotos/dui/theming/platform'`), while runtime switching is powered by a built-in, zero-third-party-JSS CSS rule serializer (`ThemeService` / `serializeThemeRulesToCss`) that mounts and updates ordered `<style>` DOM tags (`core` → `material-theme` → `component`) in `document.head` (deliberately avoiding `adoptedStyleSheets` so enterprise DOM cascade order remains 100% deterministic):
  - **3 Theme Modes**: `light`, `dark`, and industrial `darkblue`;
  - **3 Density & Typography Levels**: `loose` (density `0`), `normal` (density `-1`), and `compact` (density `-2`);
  - **2 Form Field Appearances**: `fill` and `outline`.

- **Strict CSP Compliance (Zero `unsafe-eval`) & Defense-in-Depth XSS Hardening**
  Zero dynamic `Function` constructors or `eval` calls anywhere in `src/`. Dynamic form and component expressions run on a pure, zero-dependency recursive-descent parser and evaluator (`safe-expr.ts`) alongside an AST-based `Parse` service (`@dotos/dui/core/angular2parse`) that strictly blocks `__proto__`, `constructor`, and `prototype` pollution as well as global object escapes—ready out of the box for `Content-Security-Policy: script-src 'self'` environments, paired with inert `DOMParser`-based HTML/SVG sanitization and hardened URL pipes.

- **95 High-Cohesion Secondary Entry Points & Strict Tree-Shaking**
  Root `@dotos/dui` intentionally exports `{}` to prevent barrel bloat; all functionality is partitioned into **95 independent TypeScript secondary entry points**. Heavy rich-text, code, and terminal engines are decoupled from the core package, leaving just **7 lightweight runtime dependencies** (`buffer`, `colornames`, `element-resize-detector`, `fuse.js`, `minimatch-browser`, `perfect-scrollbar`, `tslib`).

- **12 Built-in Locale Bundles & Native `Intl` Formatting (with RTL Support)**
  Ships **12 complete locale JSON bundles** (`zh_CN` Simplified Chinese, `zh_TW` Traditional Chinese, `en_US` English, `ja_JP` Japanese, `ko_KR` Korean, `de_DE` German, `fr_FR` French, `es_419` Latin American Spanish, `pt_BR` Brazilian Portuguese, `ru_RU` Russian, `ar_SA` Arabic RTL, `id_ID` Indonesian), verified for key-set parity and non-untranslated cognates in CI and paired with browser-native `Intl` number and date formatting.

- **AI-Native Zero-Hallucination Engineering Foundation**
  Ships an AST-verified [`llms.txt`](./src/llms.txt) contract inside the npm package, backed by **16,900+ bilingual English/`@zh` JSDoc annotations** across `src/` and **10+ deterministic CI quality gates**, enabling Cursor, Claude Code, GitHub Copilot, and Antigravity agents to generate accurate imports, selectors, and `@Input('alias')` / `@Output('alias')` bindings without hallucination.

---

## DotOS Frontend Engineering Suite

`@dotos/dui` serves as the open-source core of the **DotOS Frontend Engineering Suite**, designed both for standalone Angular 22 applications and seamless composition with specialized enterprise engines:

| Package | Role & Core Capabilities | Licensing |
| :--- | :--- | :--- |
| **`@dotos/dui`** | **Enterprise Angular 22 UI Component & Dynamic Theming Foundation** — 95 modular entry points, JSON-schema dynamic forms, virtualized trees & data tables, dockable workbench layouts, millisecond 3-state theming, and 12-locale i18n | **MIT Open Source** |
| **`@dotos/duix`** | **DotOS Pro Enterprise Extension Suite** — Spreadsheet-grade data grid, Gantt/scheduler, ProseMirror rich-text editor, standalone Monaco code editor (`@dotos/duix/ux/monaco-editor`), xterm web terminal, and industrial workbench extensions | Commercial / Enterprise |
| **`@dotos/xdraw`** | **2D GPU / Vector Graphics & Topology Engine** — High-performance vector rendering engine for industrial SCADA, CAD diagrams, architecture topologies, and interactive flowcharts | Commercial / Enterprise |
| **`@dotos/aioffice`** | **AI Office & Enterprise Report Suite** — Integrated online documents, spreadsheets, complex enterprise BI report designer, and AI-assisted office workflows | Commercial / Enterprise |

---

## Installation, Global SCSS & i18n Setup

### 1. Install Core Package & Peer Dependencies

```bash
npm install @dotos/dui
```

Ensure standard Angular 22 and utility `peerDependencies` are installed in your host Angular 22 workspace:

```bash
npm install @angular/animations@^22.0.0 @angular/cdk@^22.0.0 @angular/common@^22.0.0 \
  @angular/core@^22.0.0 @angular/forms@^22.0.0 @angular/material@^22.0.0 \
  @angular/platform-browser@^22.0.0 @angular/router@^22.0.0 \
  rxjs@^7.8.0 lodash-es@^4.17.21 mobx@^6.0.0 moment@^2.29.1
```

> **Optional Peer Dependencies**:
> - `@angular/material-moment-adapter@^22.0.0` — Only required when using the Moment datetime adapter (`@dotos/dui/form/date/moment`);
> - `highlight.js@^11.11.1` — Only required when using syntax highlighting (`@dotos/dui/ux/highlight`).

### 2. Import Platform SCSS Stylesheet Entry

Import the platform SCSS stylesheet in your global `src/styles.scss` via Sass `@use` (note: `@dotos/dui/theming/*` are SCSS style sub-paths, not TypeScript modules):

```scss
@use '@dotos/dui/theming/platform';
```

Granular SCSS helper sub-paths are also exported for custom component mixins:
- `@use '@dotos/dui/theming/all-theme';`
- `@use '@dotos/dui/theming/theming';`
- `@use '@dotos/dui/theming/styles/elevation';`

### 3. Configure Built-in 12-Locale Static Asset Bundles

`i18n/dui/*.json` is a static JSON asset folder (not a TypeScript module entry point). Add an asset mapping in your host `angular.json` to serve all 12 built-in locale bundles:

```json
{
  "glob": "**/*",
  "input": "node_modules/@dotos/dui/i18n",
  "output": "/assets/i18n"
}
```

Included locale bundles: `zh_CN.json`, `zh_TW.json`, `en_US.json`, `ja_JP.json`, `ko_KR.json`, `de_DE.json`, `fr_FR.json`, `es_419.json`, `pt_BR.json`, `ru_RU.json`, `ar_SA.json`, `id_ID.json`.

---

## 5-Minute Quickstart

### 1. Millisecond 3-State Dynamic Theme Switching (`@dotos/dui/theme`)

```typescript
import { Component } from '@angular/core';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

@Component({
  selector: 'app-theme-bar',
  template: `
    <button (click)="applyTheme('light')">Light Mode</button>
    <button (click)="applyTheme('dark')">Dark Mode</button>
    <button (click)="applyTheme('darkblue')">Industrial DarkBlue</button>
  `,
})
export class ThemeBarComponent {
  constructor(
    private readonly dotosConfig: DotosConfigService,
    public readonly themeService: ThemeService // Inject once at root to activate runtime <style> management
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

### 2. JSON-Driven Dynamic Schema Form (`@dotos/dui/form`)

Dynamic forms evaluate visibility and disabled expressions through DUI's CSP-safe expression engine without `unsafe-eval`:

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
        label: 'Cluster Name',
        required: true,
        wrappers: ['form-field'],
      },
      {
        xtype: 'select-field',
        name: 'region',
        label: 'Availability Region',
        wrappers: ['form-field'],
        options: [
          { label: 'North China 1 (cn-north-1)', value: 'cn-north-1' },
          { label: 'Asia Pacific East 1 (ap-east-1)', value: 'ap-east-1' },
        ],
      },
    ],
  };
}
```

### 3. Modal Confirm & Alert Dialogs (`@dotos/dui/common/dialogs`)

```typescript
import { Component } from '@angular/core';
import { DialogsModule, DialogService } from '@dotos/dui/common/dialogs';

@Component({
  selector: 'app-release-trigger',
  imports: [DialogsModule],
  template: `<button (click)="confirmRelease()">Roll Out Configuration</button>`,
})
export class ReleaseTriggerComponent {
  constructor(private readonly dialogService: DialogService) {}

  confirmRelease(): void {
    this.dialogService
      .openConfirm({
        title: 'Confirm Rollout',
        message: 'Are you sure you want to apply the latest cluster configuration now?',
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dialogService.openAlert({
            title: 'Completed',
            message: 'Cluster configuration has been applied successfully.',
          });
        }
      });
  }
}
```

### 4. Virtualized Tree View & Enterprise Data Table (`@dotos/dui/tree` & `@dotos/dui/data/datatable`)

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
      name: 'Production Core Cluster',
      children: [
        { id: 2, name: 'Edge Gateway Nodes' },
        { id: 3, name: 'Compute Worker Nodes' },
      ],
    },
  ];

  columns = [
    { prop: 'node', name: 'Node ID' },
    { prop: 'role', name: 'Role' },
    { prop: 'latency', name: 'Latency (ms)' },
  ];

  rows = [
    { node: 'gw-01', role: 'Ingress', latency: 4.2 },
    { node: 'wk-01', role: 'Compute', latency: 1.8 },
  ];
}
```

---

## Dynamic Theming & 3-Tier Density Guide

`ThemeService` (from `@dotos/dui/theme`) allows programmatic, zero-reload switching across color palettes, theme modes, density scales, and form field appearances:

```typescript
// Direct call: ThemeService.changeTheme(primary, accent, warn, mode, densityTypography, formType)
themeService.changeTheme(
  'teal-600',   // Primary palette hue (supports full Material palettes, e.g., 'blue-500', 'indigo-600')
  'orange-800', // Accent palette hue
  'red-800',    // Warn palette hue
  'darkblue',   // Theme mode: 'light' | 'dark' | 'darkblue'
  'compact',    // Density & typography scale: 'loose' (0) | 'normal' (-1) | 'compact' (-2)
  'outline'     // Form field appearance: 'fill' | 'outline'
);
```

On every theme update, `ThemeService` synchronizes:
1. `data-theme="light|dark|darkblue"` and `data-density="loose|normal|compact"` attributes on `document.documentElement`;
2. `dui-density-loose` / `dui-density-normal` / `dui-density-compact` classes on `document.body`;
3. Strictly ordered `<style>` elements inside `<head>` (`data-dui-role="core"` → `data-dui-role="material-theme"` → `data-dui-role="component"`), with reactive per-component theme registration via `themeService.loadTheme(themeFn)`.

---

## AI-Native Developer Experience & Quality Gates

### 1. Built-in `llms.txt` Zero-Hallucination Contract

Once installed, `node_modules/@dotos/dui/llms.txt` (also exported via `@dotos/dui/llms.txt`) provides a structured single-file reference tailored for LLMs. Point Cursor, Claude Code, GitHub Copilot, or Antigravity to `node_modules/@dotos/dui/llms.txt` for AST-verified entry-point imports, selectors, and public `@Input` / `@Output` bindings.

### 2. Deterministic CI Quality Gates

`@dotos/dui` enforces strict automated engineering gates across development and CI pipelines:

| Gate Command | Verification Scope |
| :--- | :--- |
| `npm run gate:tsc` | Full TypeScript type-checking across all 96 `ng-package.json` entry points (1 root + 95 secondary) |
| `npm run gate:any` | TypeScript type-checker ratchet counting explicit/implicit `any`, inferred `{}` empty objects, and double casts |
| `npm run gate:jsdoc` | Verifies 16,900+ bilingual English/`@zh` JSDoc parameter and return types against real AST types |
| `npm run gate:llms` | AST + `ng-package.json` verification of all 95 entry points, snippet compilation, selectors, and public binding aliases in `src/llms.txt` |
| `npm run gate:i18n` | Enforces identical key sets and genuine translations across all 12 locale bundles |
| `npm run gate:esm` | Blocks CommonJS `lodash` / `lodash/fp` imports to preserve pure ESM tree-shaking |
| `npm run gate:ng22-compat` | Enforces Angular 22 compatibility (no deprecated symbols, no JSS regression, Ivy Partial mode, `::ng-deep` ratchet) |
| `npm run gate:style-ref` | Validates Angular Material 22 SCSS style reference conventions |
| `npm run gate:standalone` | Verifies explicit `standalone: false` consistency across NgModule-declared components and directives |
| `npm run gate:pkg-deps` | Verifies zero phantom dependencies, zero dead dependencies, and zero legacy flex-layout imports in built artifacts |

---

## All 95 Secondary Entry Points Reference

> Always import from specific secondary entry points (`@dotos/dui/<category>/<module>`) rather than the bare root package `@dotos/dui`.

### `base` — Event Bus, DOM Sanitization & Safe Expression Utilities (1)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/base` | `addClass`, `AngularEventEmitter`, `attributes`, `Base`, `DuiBase` (+42) | - |

### `common` — 36 Modular UI Components, Overlays & Directives (36)

| Secondary Entry Point | Primary Exports | Selectors |
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

### `container` — Multi-Tab Dockable Workbench, Gridster Canvas & Split Layouts (3)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/container/dock-layout` | `DockLayoutModule`, `DockLayoutHostComponent`, `DockLayoutComponentService`, `DockLayoutManagerService` | `dock-layout-host` |
| `@dotos/dui/container` | `CardModule`, `DuiTabsModule`, `ExpansionModule`, `GridsterModule` (+31) | `accordion`, `card`, `[duiLayoutClose]` |
| `@dotos/dui/container/layout` | `DuiLayoutModule`, `DuiPanelComponent`, `LayoutComponent`, `AbstractPanel` (+1) | `dui-panel`, `dui-layout`, `dui-split-area, [dui-split-area]` |

### `core` — Enterprise Core Infrastructure (Auth, Cache, Config, Crypto, Dynamic, MobX, Storage) (20)

| Secondary Entry Point | Primary Exports | Selectors |
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

### `data` — Virtualized Data Table, Card Detail View & Paging Bar (3)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/data/cardview` | `CardViewModule`, `CardViewArrayItemComponent`, `CardViewBoolItemComponent`, `CardViewComponent` (+9) | `dui-card-view-arrayitem`, `dui-card-view-boolitem`, `dui-card-view` |
| `@dotos/dui/data/datatable` | `DatatableModule`, `DataTableBodyCellComponent`, `DataTableBodyComponent`, `DataTableBodyRowComponent` (+28) | `datatable-body-cell`, `datatable-body`, `datatable-body-row`, `dui-datatable` |
| `@dotos/dui/data/paging` | `DuiPagingModule`, `DuiPagingBarComponent` | `dui-paging-bar` |

### `form` — JSON Schema Dynamic Forms & Date/Time/Range Controls (8)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/form/card` | `FormCardModule`, `FormCard` | `form-card` |
| `@dotos/dui/form/date` | `DateFieldModule`, `DateFieldComponent` | `date-field` |
| `@dotos/dui/form/date/adapter` | `MatNativeDatetimeModule`, `NativeDatetimeModule`, `NativeDatetimeAdapter` | - |
| `@dotos/dui/form/date/moment` | `MatMomentDatetimeModule`, `MomentDatetimeModule`, `MomentDatetimeAdapter` | - |
| `@dotos/dui/form/date/picker` | `MatDatetimepickerModule`, `MatDatetimepicker`, `MatDatetimepickerCalendar`, `MatDatetimepickerCalendarBody` (+7) | `mat-datetimepicker`, `mat-datetimepicker-calendar`, `[mat-datetimepicker-calendar-body]` |
| `@dotos/dui/form` | `ArrayInputModule`, `CheckBoxFieldModule`, `CheckboxGroupModule`, `ColorFieldModule` (+50) | `array-input-field`, `[duiAutoTrim]`, `checkbox-field`, `dui-form` |
| `@dotos/dui/form/range` | `RangeFieldModule`, `DateRangeFieldComponent`, `NumberRangeFieldComponent`, `RangeField` | `date-range-field`, `number-range-field` |
| `@dotos/dui/form/toggle-select` | `ToggleSelectModule`, `ToggleHeaderComponent`, `ToggleSelectComponent`, `ToggleOption` | `toggle-header`, `toggle-option`, `toggle-select` |

### `net` — HTTP Interceptor Chain & Global Request Loader (1)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/net` | `HttpLoaderModule`, `HttpLoaderComponent`, `CacheInterceptor`, `ErrorInterceptor` (+7) | `http-loader` |

### `theme` — Millisecond 3-State Runtime Dynamic Theming Engine (1)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/theme` | `DotosConfigModule`, `DotosConfigService`, `ThemeService` | - |

### `translator` — Runtime i18n Service, Pipe & Native `Intl` Formatting Bridge (1)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/translator` | `TranslateModule`, `FakeMissingTranslationHandler`, `TranslateDefaultParser`, `TranslateFakeCompiler` (+8) | `[translate],[ngx-translate]` |

### `tree` — Virtualized Tree View & Drag-and-Drop Reordering (1)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/tree` | `TreeModule`, `LoadingComponent`, `TreeComponent`, `TreeNodeCheckboxComponent` (+15) | `tree-loading-component`, `[treeAnimateOpen]`, `Tree, tree-root` |

### `ui` — Interactive Buttons, Context Menus, Toolbars & Topbars (7)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/ui/button` | `ButtonModule`, `ToggleButtonModule`, `ButtonComponent`, `ToggleButtonComponent` | `dui-button`, `toggle-button` |
| `@dotos/dui/ui/color-button` | `ColorPickerButtonModule`, `ColorPickerButton` | `colorpicker-button` |
| `@dotos/dui/ui/context-menu` | `ContextMenuModule`, `ContextMenuComponent`, `ContextMenuItemComponent`, `ContextMenuService` (+1) | `dui-context-menu`, `dui-context-menu-item`, `[duiContextMenuOutsideEvent]` |
| `@dotos/dui/ui/menu` | `MenuModule`, `MenuBarComponent`, `MenuItemComponent`, `MenuBase` (+1) | `dui-menu-bar`, `[menu-host]`, `dui-menu-item` |
| `@dotos/dui/ui/speeddial` | `SpeedDialModule`, `ExtSpeedDialComponent`, `FabButtonComponent`, `SpeedDialActionsComponent` (+2) | `speeddial`, `fabbutton`, `speed-dial-actions` |
| `@dotos/dui/ui/toolbar` | `DuiToolbarModule`, `DuiToolbarComponent`, `Fill`, `Separator` (+2) | `dui-toolbar`, `tbfill`, `divider` |
| `@dotos/dui/ui/topbar` | `TopbarModule`, `ToolbarDividerComponent`, `TopbarComponent`, `TopbarTitleComponent` | `dui-topbar-divider`, `dui-topbar`, `dui-topbar-title` |

### `util` — Activity Monitor, JPEG Codec & 19 Formatting/Sanitization Pipes (3)

| Secondary Entry Point | Primary Exports | Selectors |
| :--- | :--- | :--- |
| `@dotos/dui/util` | `ExtUtilModule`, `ActivityInterceptor`, `ActivityService` | - |
| `@dotos/dui/util/jpeg` | `decode`, `encode` | - |
| `@dotos/dui/util/pipes` | `DuiPipesModule`, `BytesPipe`, `CamelCaseToDashPipe`, `ClonePipe` (+16) | - |

### `ux` — Workbench UX Suite (Command Palette, Query Builder, Multi-Window, Floating Windows, Highlight) (10)

> **Note on `ExtCodeEditorComponent` (`td-code-editor`) in `@dotos/dui/ux`**: `@dotos/dui` does not bundle `monaco-editor`. When the host application loads global `window.monaco`, `td-code-editor` dynamically attaches to it; for the standalone `MonacoEditorModule` integration, use `@dotos/duix/ux/monaco-editor` from the Pro extension suite.

| Secondary Entry Point | Primary Exports | Selectors |
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

## Open Source License & Third-Party Notices

- **License**: Released under the [MIT License](./LICENSE), developed and maintained by Beijing Shangdian Information Technology Co., Ltd. (北京商典信息科技有限公司).
- **Third-Party Notices**: Full copyright attributions and standard license texts for runtime dependencies, peer dependencies, and adapted open-source modules are documented in [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).
- **Release & Verification Runbook**: See [RELEASE_GUIDE.md](./RELEASE_GUIDE.md).
- **Repository & Issues**: <https://github.com/dotos1/dui>
