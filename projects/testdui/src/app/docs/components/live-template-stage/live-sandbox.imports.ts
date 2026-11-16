/**
 * @fileoverview Module `projects/testdui/src/app/docs/components/live-template-stage/live-sandbox.imports.ts` declaring the module whitelist available to runtime-compiled sandbox templates.
 * @zh 模块文件 `projects/testdui/src/app/docs/components/live-template-stage/live-sandbox.imports.ts`，声明运行时编译沙箱模板可用的模块白名单（同时用于生成 TypeScript 集成示例与 StackBlitz 工程）。
 */

/**
 * Interface `LiveSandboxImport` describing one importable symbol for code generation.
 * @zh 接口 `LiveSandboxImport`，描述一个可导入符号（用于生成集成示例代码）。
 */
export interface LiveSandboxImport {
  /**
   * Exported symbol name.
   * @zh 导出符号名。
   */
  symbol: string;
  /**
   * Module specifier (internal `@dotos1/dui` scope).
   * @zh 模块路径（内部 `@dotos1/dui` 作用域）。
   */
  from: string;
}

/**
 * Constant `LIVE_SANDBOX_IMPORTS` listing all modules visible to sandbox templates.
 * @zh 常量 `LIVE_SANDBOX_IMPORTS`，沙箱模板可见的全部模块（Angular 基础 + 常用 Material + `@dotos1/dui` 常用 UI），用于生成 AOT 集成示例代码；运行时导入见 `live-sandbox.runtime-scope.ts`。
 */
export const LIVE_SANDBOX_IMPORTS: readonly LiveSandboxImport[] = [
  { symbol: 'CommonModule', from: '@angular/common' },
  { symbol: 'FormsModule', from: '@angular/forms' },
  { symbol: 'ReactiveFormsModule', from: '@angular/forms' },
  { symbol: 'MatBadgeModule', from: '@angular/material/badge' },
  { symbol: 'MatButtonModule', from: '@angular/material/button' },
  { symbol: 'MatCardModule', from: '@angular/material/card' },
  { symbol: 'MatCheckboxModule', from: '@angular/material/checkbox' },
  { symbol: 'MatChipsModule', from: '@angular/material/chips' },
  { symbol: 'MatDividerModule', from: '@angular/material/divider' },
  { symbol: 'MatFormFieldModule', from: '@angular/material/form-field' },
  { symbol: 'MatIconModule', from: '@angular/material/icon' },
  { symbol: 'MatInputModule', from: '@angular/material/input' },
  { symbol: 'MatProgressBarModule', from: '@angular/material/progress-bar' },
  { symbol: 'MatSlideToggleModule', from: '@angular/material/slide-toggle' },
  { symbol: 'MatSliderModule', from: '@angular/material/slider' },
  { symbol: 'MatTooltipModule', from: '@angular/material/tooltip' },
  { symbol: 'ButtonModule', from: '@dotos1/dui/ui/button' },
  { symbol: 'DuiToolbarModule', from: '@dotos1/dui/ui/toolbar' },
  { symbol: 'AvatarModule', from: '@dotos1/dui/ux/avatar' },
  { symbol: 'HighlightModule', from: '@dotos1/dui/ux/highlight' },
  { symbol: 'CardModule', from: '@dotos1/dui/container' },
];

/**
 * Builds grouped `import { ... } from '...'` lines for given symbols.
 * @zh 将导入清单按模块路径分组，生成 `import { ... } from '...'` 语句。
 * @param imports - Import descriptors / 导入描述
 * @param scope - Replacement scope for `@dotos1/dui` (e.g. `@dotos/dui` for public npm) / `@dotos1/dui` 替换作用域（公网为 `@dotos/dui`）
 * @returns Import statement block / 导入语句块
 */
export function renderImportLines(imports: readonly LiveSandboxImport[], scope = '@dotos1/dui'): string {
  const groups = new Map<string, string[]>();
  for (const item of imports) {
    const from = item.from.replace(/^@dotos1\/dui/, scope);
    const list = groups.get(from) ?? [];
    list.push(item.symbol);
    groups.set(from, list);
  }
  return Array.from(groups.entries())
    .map(([from, symbols]) => `import { ${symbols.join(', ')} } from '${from}';`)
    .join('\n');
}
