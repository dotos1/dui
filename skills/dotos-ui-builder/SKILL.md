---
name: dotos-ui-builder
description: Enterprise Angular 22 UI engineering skill for @dotos/dui. Enforces 100% Standalone + Signals + OnPush + Zoneless architecture, high-density CSS Grid split-dock workspaces, WAI-ARIA Signal trees, and zero-any @dotos/dui/schema forms.
---

# DotOS Enterprise UI Builder (`@dotos/dui` v8)

## Mandatory Default Architecture Rule / 强制默认架构铁律

> **ALL newly developed features and ALL AI-generated Angular components MUST 100% default to `standalone: true` + Angular Signals (`input()`, `model()`, `output()`, `computed()`, `signal()`) + `ChangeDetectionStrategy.OnPush` + Zoneless (`provideDuiZoneless()`).**
> **所有新开发功能与 AI 生成的新组件，100% 强制默认采用 `Standalone + Signals + OnPush + Zoneless`！**

Never generate legacy `@NgModule`, `standalone: false`, `@Input()` / `@Output()` decorators, `Zone.js` microtask assumptions, `fxLayout`/`fxFlex`, `::ng-deep`, `.mdc-*` selectors, or `any` types in new code.

---

## 1. Standard Enterprise Workspace Blueprint / 企业级高密度停靠工作台规范

For B2B SCADA, PLM, BIM, and ERP screens, compose layouts from `@dotos/dui/standalone`:

1. **Shell Split-Dock (`<dui-standalone-split-dock>`)**:
   - Place navigation or asset hierarchy inside `<div duiDockSidebar>...</div>`.
   - Bind `[(collapsed)]="sidebarCollapsed"` (`signal(false)`) and `sidebarSize="'260px'"` for high-density 1080p/1440p viewports.
2. **Hierarchy Navigation (`<dui-standalone-tree>`)**:
   - Drive via `readonly DuiTreeNodeItem[]`, two-way `[(expandedIds)]`, `[(selectedId)]`, and `(nodeActivated)`.
   - Zero MobX — state transitions are pure immutable Signal updates with built-in WAI-ARIA `tree` / `treeitem` keyboard navigation (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `Enter`, `Space`).
3. **Contextual Detail Views (`<dui-standalone-tabs>` + `<dui-standalone-card>`)**:
   - Use `<dui-standalone-tabs [tabs]="tabs()" [(activeId)]="activeTab">` for multi-panel switching without layout shift.
   - Wrap KPI blocks and inspector forms in `<dui-standalone-card [padding]="'compact'">` for industrial high-density screens.

---

## 2. Zero-`any` Declarative Form Workflow / 声明式零 `any` 表单规范

1. Define form metadata strictly with `DuiFormSchema` from `@dotos/dui/schema` (`columns: 2` or `3`, `density: 'compact'` for dense enterprise inspectors).
2. Always pre-validate dynamic/AI-constructed schemas via `validateDuiFormSchema(candidate)`:
   - Inspect `result.valid` and `result.findings`.
   - Each `DuiSchemaFinding` provides `path`, `code`, `severity`, `message`, and an actionable self-healing `hint` (for example, auto-correcting `type: 'textfield'` to `type: 'text'` or fixing `min > max`).
3. Bind `<dui-standalone-form [schema]="schema()" [(value)]="formData" (submitted)="onSave($event)">` where `formData` is `signal<Record<string, DuiFormPrimitiveValue>>({})`.

---

## 3. Theme & Styling Checklist / 主题与样式检查清单

- Use `var(--dui-surface)`, `var(--dui-surface-container)`, `var(--dui-on-surface)`, `var(--dui-primary)`, `var(--dui-on-primary)`, `var(--dui-warn)`, `var(--dui-outline-variant)` with `--mat-sys-*` fallbacks so Light, Dark, and Industrial DarkBlue (`darkblue`) modes work automatically without JS `loadTheme(...)` calls.
- Use native CSS Grid (`display: grid; gap: 12px;`) and Flexbox (`display: flex; align-items: center;`).
- Reference golden single-file examples shipped in `@dotos/dui/examples/`:
  - `zoneless-Form.example.ts`
  - `zoneless-tree-dock.example.ts`
  - `zoneless-tabs-card.example.ts`
