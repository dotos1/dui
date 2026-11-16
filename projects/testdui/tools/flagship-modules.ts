/**
 * @fileoverview Module `projects/testdui/tools/flagship-modules.ts` providing interactive example module registry definitions and implementation.
 * @zh 模块文件 `projects/testdui/tools/flagship-modules.ts`，提供可交互示例模块清单相关的定义与实现。
 */

/**
 * 全量 102 个 `@dotos1/dui` 二级入口模块清单，均在文档站里提供可交互的 Examples 页面。
 * category/moduleId 与 `generate-api-docs.ts` 对入口目录计算出的 category/moduleId 完全一致（空层级用 "index"）。
 * @zh 全量 102 个 `@dotos1/dui` 二级入口模块清单，均在文档站里提供真正可交互的 Examples 页面。
 */
export const FLAGSHIP_MODULES: Array<{ category: string; moduleId: string }> = [
  { category: 'base', moduleId: 'index' },
  { category: 'common', moduleId: 'animations' },
  { category: 'common', moduleId: 'backdrop' },
  { category: 'common', moduleId: 'breadcrumbs' },
  { category: 'common', moduleId: 'carousel' },
  { category: 'common', moduleId: 'clickout' },
  { category: 'common', moduleId: 'clipboard' },
  { category: 'common', moduleId: 'collapsible' },
  { category: 'common', moduleId: 'colorpicker--common' },
  { category: 'common', moduleId: 'colorpicker--components' },
  { category: 'common', moduleId: 'dialogs' },
  { category: 'common', moduleId: 'directives' },
  { category: 'common', moduleId: 'dnd' },
  { category: 'common', moduleId: 'dragselect' },
  { category: 'common', moduleId: 'dynamic' },
  { category: 'common', moduleId: 'fileupload' },
  { category: 'common', moduleId: 'icon' },
  { category: 'common', moduleId: 'icon-sprite' },
  { category: 'common', moduleId: 'iframe' },
  { category: 'common', moduleId: 'inline-svg' },
  { category: 'common', moduleId: 'keyboard' },
  { category: 'common', moduleId: 'loading' },
  { category: 'common', moduleId: 'matcolorpicker' },
  { category: 'common', moduleId: 'media' },
  { category: 'common', moduleId: 'message' },
  { category: 'common', moduleId: 'notifications' },
  { category: 'common', moduleId: 'password' },
  { category: 'common', moduleId: 'perfect-scrollbar' },
  { category: 'common', moduleId: 'popover' },
  { category: 'common', moduleId: 'print' },
  { category: 'common', moduleId: 'resize-element' },
  { category: 'common', moduleId: 'screenfull' },
  { category: 'common', moduleId: 'scrollbar' },
  { category: 'common', moduleId: 'search-box' },
  { category: 'common', moduleId: 'stop-propagation' },
  { category: 'common', moduleId: 'svg' },
  { category: 'common', moduleId: 'toastr' },
  { category: 'common', moduleId: 'trigger' },
  { category: 'container', moduleId: 'dock-layout' },
  { category: 'container', moduleId: 'index' },
  { category: 'container', moduleId: 'layout' },
  { category: 'core', moduleId: 'angular2parse' },
  { category: 'core', moduleId: 'animation' },
  { category: 'core', moduleId: 'auth' },
  { category: 'core', moduleId: 'auth--lock' },
  { category: 'core', moduleId: 'behaviors' },
  { category: 'core', moduleId: 'cache' },
  { category: 'core', moduleId: 'color' },
  { category: 'core', moduleId: 'config' },
  { category: 'core', moduleId: 'cookie' },
  { category: 'core', moduleId: 'crypt' },
  { category: 'core', moduleId: 'decorators' },
  { category: 'core', moduleId: 'dynamic' },
  { category: 'core', moduleId: 'form' },
  { category: 'core', moduleId: 'index' },
  { category: 'core', moduleId: 'media' },
  { category: 'core', moduleId: 'meta' },
  { category: 'core', moduleId: 'mobx' },
  { category: 'core', moduleId: 'position' },
  { category: 'core', moduleId: 'services' },
  { category: 'core', moduleId: 'storage' },
  { category: 'data', moduleId: 'cardview' },
  { category: 'data', moduleId: 'datatable' },
  { category: 'data', moduleId: 'paging' },
  { category: 'form', moduleId: 'card' },
  { category: 'form', moduleId: 'date' },
  { category: 'form', moduleId: 'date--adapter' },
  { category: 'form', moduleId: 'date--moment' },
  { category: 'form', moduleId: 'date--picker' },
  { category: 'form', moduleId: 'index' },
  { category: 'form', moduleId: 'range' },
  { category: 'form', moduleId: 'toggle-select' },
  { category: 'net', moduleId: 'index' },
  { category: 'theme', moduleId: 'index' },
  { category: 'translator', moduleId: 'index' },
  { category: 'tree', moduleId: 'index' },
  { category: 'ui', moduleId: 'button' },
  { category: 'ui', moduleId: 'color-button' },
  { category: 'ui', moduleId: 'context-menu' },
  { category: 'ui', moduleId: 'menu' },
  { category: 'ui', moduleId: 'speeddial' },
  { category: 'ui', moduleId: 'toolbar' },
  { category: 'ui', moduleId: 'topbar' },
  { category: 'util', moduleId: 'index' },
  { category: 'util', moduleId: 'jpeg' },
  { category: 'util', moduleId: 'pipes' },
  { category: 'ux', moduleId: 'avatar' },
  { category: 'ux', moduleId: 'command-palette' },
  { category: 'ux', moduleId: 'editor' },
  { category: 'ux', moduleId: 'highlight' },
  { category: 'ux', moduleId: 'iconpicker' },
  { category: 'ux', moduleId: 'index' },
  { category: 'ux', moduleId: 'jsonEditor' },
  { category: 'ux', moduleId: 'line-style' },
  { category: 'ux', moduleId: 'link-preview' },
  { category: 'ux', moduleId: 'markdown' },
  { category: 'ux', moduleId: 'markdown-editor' },
  { category: 'ux', moduleId: 'monaco-editor' },
  { category: 'ux', moduleId: 'multi-window' },
  { category: 'ux', moduleId: 'query-builder' },
  { category: 'ux', moduleId: 'terminal' },
  { category: 'ux', moduleId: 'windows' },
  { category: 'i18n', moduleId: 'index' },
  { category: 'theming', moduleId: 'index' },
];

/**
 * Executes `isFlagshipModule` to determine whether a module provides an interactive example page.
 * @zh 执行 `isFlagshipModule`，判断指定分类与模块是否启用可交互示例标签页（全量模块均返回 `true`）。
 * @param category - category parameter (`string`) / 分类参数（`string`）
 * @param moduleId - module id parameter (`string`) / 模块唯一标识参数（`string`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isFlagshipModule(category: string, moduleId: string): boolean {
  return (
    FLAGSHIP_MODULES.some((m) => m.category === category && m.moduleId === moduleId) ||
    Boolean(category && moduleId)
  );
}
