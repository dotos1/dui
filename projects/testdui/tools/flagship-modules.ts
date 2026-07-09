/**
 * ~20 个精选的高频组件，会在文档站里获得真正可交互的 Examples 页面。
 * category/moduleId 必须与 generate-api-docs.ts 里对入口目录计算出的
 * category/moduleId 完全一致（moduleId 为空层级时用 "index"）。
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
  { category: 'container', moduleId: 'index' },
  { category: 'container', moduleId: 'dock-layout' },
  { category: 'tree', moduleId: 'index' },
  { category: 'data', moduleId: 'datatable' },
  { category: 'form', moduleId: 'index' },
  { category: 'ux', moduleId: 'command-palette' },
  { category: 'ux', moduleId: 'markdown' },
  { category: 'ux', moduleId: 'terminal' },
  { category: 'ux', moduleId: 'editor' },
  { category: 'ux', moduleId: 'monaco-editor' },
];

export function isFlagshipModule(category: string, moduleId: string): boolean {
  return FLAGSHIP_MODULES.some((m) => m.category === category && m.moduleId === moduleId);
}
