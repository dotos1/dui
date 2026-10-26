/**
 * ~20 个精选的高频组件，会在文档站里获得真正可交互的 Examples 页面。
 * category/moduleId 必须与 generate-api-docs.ts 里对入口目录计算出的
 * category/moduleId 完全一致（moduleId 为空层级时用 "index"）。

 * @zh ~20 个精选的高频组件，会在文档站里获得真正可交互的 Examples 页面。
 */
export const FLAGSHIP_MODULES: Array<{ category: string; moduleId: string }> = [
  { category: 'ui', moduleId: 'button' },
  { category: 'ui', moduleId: 'topbar' },
  { category: 'ui', moduleId: 'speeddial' },
  { category: 'ui', moduleId: 'menu' },
  { category: 'ui', moduleId: 'context-menu' },
  { category: 'common', moduleId: 'toastr' },
  { category: 'common', moduleId: 'collapsible' },
  { category: 'common', moduleId: 'search-box' },
  { category: 'common', moduleId: 'dialogs' },
  { category: 'common', moduleId: 'breadcrumbs' },
  { category: 'common', moduleId: 'loading' },
  { category: 'container', moduleId: 'index' },
  { category: 'container', moduleId: 'dock-layout' },
  { category: 'container', moduleId: 'layout' },
  { category: 'tree', moduleId: 'index' },
  { category: 'data', moduleId: 'datatable' },
  { category: 'data', moduleId: 'cardview' },
  { category: 'data', moduleId: 'paging' },
  { category: 'form', moduleId: 'index' },
  { category: 'theme', moduleId: 'index' },
  { category: 'translator', moduleId: 'index' },
  { category: 'ux', moduleId: 'command-palette' },
  { category: 'ux', moduleId: 'markdown' },
  { category: 'ux', moduleId: 'terminal' },
  { category: 'ux', moduleId: 'editor' },
  { category: 'ux', moduleId: 'monaco-editor' },
  { category: 'ux', moduleId: 'highlight' },
];

/**
 * Executes `isFlagshipModule` to handle is flagship module.
 * @zh 执行 `isFlagshipModule`，用于是否为Flagship模块。
 * @param category - category parameter (`string`) / 分类参数（`string`）
 * @param moduleId - module id parameter (`string`) / 模块唯一标识参数（`string`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isFlagshipModule(category: string, moduleId: string): boolean {
  return FLAGSHIP_MODULES.some((m) => m.category === category && m.moduleId === moduleId);
}
