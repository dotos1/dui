/**
 * @fileoverview Module `projects/testdui/src/app/docs/models/category-meta.ts` providing category meta definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/models/category-meta.ts`，提供分类元数据相关的定义与实现。
 */

/**
 * Interface `CategoryMeta` defining the contract and properties for category meta.
 * @zh 接口 `CategoryMeta`，定义分类元数据的数据结构契约与属性规范。
 */
export interface CategoryMeta {
  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  icon: string;
  /**
   * Property `tagline` (`string`) storing tagline.
   * @zh 属性 `tagline`（类型：`string`），用于存储或配置tagline。
   */
  tagline: string;
}

/**
 * Static per-category icon + one-sentence theme description for the docs
 * navigation (nav tree / category cards). Keyed by the category id used in
 * `manifest.json` (e.g. 'common', 'ux').

 * @zh 常量/变量 `CATEGORY_META`，定义 `projects/testdui/src/app/docs/models` 中的分类元数据。
 */
export const CATEGORY_META: Record<string, CategoryMeta> = {
  base: {
    icon: 'foundation',
    tagline: '组件库的最底层运行时基础设施，提供事件、基类与 DOM 操作等公共能力。',
  },
  common: {
    icon: 'apps',
    tagline: '数量最多的可复用小型构建块集合，涵盖提示、对话框、拖拽、颜色选择等高频场景。',
  },
  container: {
    icon: 'view_quilt',
    tagline: '搭建应用布局骨架的容器型组件，从面板标签页到 IDE 级窗口停靠系统。',
  },
  core: {
    icon: 'settings_applications',
    tagline: '应用启动阶段必备的框架级基础设施，涵盖鉴权、配置、存储与响应式集成。',
  },
  data: {
    icon: 'table_chart',
    tagline: '数据驱动的展示型组件，核心是功能完整的高性能数据表格。',
  },
  form: {
    icon: 'dynamic_form',
    tagline: 'JSON 配置驱动的动态表单引擎，声明式生成完整表单，无需手写模板。',
  },
  i18n: {
    icon: 'folder_special',
    tagline: '随库发布的中英文翻译资源目录，供 translator 运行时按需加载。',
  },
  net: {
    icon: 'http',
    tagline: 'HTTP 请求相关的基础设施，提供全局加载指示与请求状态管理。',
  },
  theme: {
    icon: 'palette',
    tagline: '基于 JSS 的运行时主题服务，动态切换主色、强调色与明暗模式。',
  },
  theming: {
    icon: 'style',
    tagline: '一组静态 Sass 样式片段，供需要编译期主题能力的场景按需引入。',
  },
  translator: {
    icon: 'translate',
    tagline: '国际化运行时，提供翻译服务、指令与管道及多资源目录管理能力。',
  },
  tree: {
    icon: 'account_tree',
    tagline: '基于 MobX 的响应式树形视图组件，支持虚拟滚动与拖拽排序。',
  },
  ui: {
    icon: 'smart_button',
    tagline: '小型高频复用的展示型控件，如按钮、工具栏、菜单与速度拨号。',
  },
  util: {
    icon: 'build',
    tagline: '框架无关的工具函数、管道与二进制编解码器集合。',
  },
  ux: {
    icon: 'auto_awesome',
    tagline: '体量更大、功能更完整的重型组件，如富文本、代码编辑器与终端模拟器。',
  },
};

/**
 * Constant/variable `DEFAULT_META` defining default meta in `projects/testdui/src/app/docs/models`.
 * @zh 常量/变量 `DEFAULT_META`，定义 `projects/testdui/src/app/docs/models` 中的默认元数据。
 */
const DEFAULT_META: CategoryMeta = { icon: 'category', tagline: '' };

/**
 * Executes `getCategoryMeta` to handle get category meta.
 * @zh 执行 `getCategoryMeta`，用于获取分类元数据。
 * @param id - id parameter (`string`) / 唯一标识参数（`string`）
 * @returns Result of type `CategoryMeta` / 类型为 `CategoryMeta` 的返回值
 */
export function getCategoryMeta(id: string): CategoryMeta {
  return CATEGORY_META[id] || DEFAULT_META;
}
