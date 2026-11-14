/**
 * @fileoverview Module `src/tree/defs/tree-node-templates.ts` defining `TreeNodeTemplates` without circular component imports.
 * @zh 模块文件 `src/tree/defs/tree-node-templates.ts`，定义独立无循环依赖的 `TreeNodeTemplates` 接口。
 */

import { TemplateRef } from '@angular/core';

/**
 * Interface `TreeNodeTemplates` defining template references passed through recursive tree node components.
 * @zh 接口 `TreeNodeTemplates`，定义递归树节点组件之间传递的模板引用集合。
 */
export interface TreeNodeTemplates {
  /**
   * Optional property `loadingTemplate` (`TemplateRef<unknown>`) storing loading template.
   * @zh 可选属性 `loadingTemplate`（类型：`TemplateRef<unknown>`），存储加载状态模板。
   */
  loadingTemplate?: TemplateRef<unknown>;
  /**
   * Optional property `treeNodeTemplate` (`TemplateRef<unknown>`) storing tree node template.
   * @zh 可选属性 `treeNodeTemplate`（类型：`TemplateRef<unknown>`），存储树节点内容模板。
   */
  treeNodeTemplate?: TemplateRef<unknown>;
  /**
   * Optional property `treeNodeWrapperTemplate` (`TemplateRef<unknown>`) storing tree node wrapper template.
   * @zh 可选属性 `treeNodeWrapperTemplate`（类型：`TemplateRef<unknown>`），存储树节点包裹模板。
   */
  treeNodeWrapperTemplate?: TemplateRef<unknown>;
  /**
   * Optional property `treeNodeFullTemplate` (`TemplateRef<unknown>`) storing tree node full template.
   * @zh 可选属性 `treeNodeFullTemplate`（类型：`TemplateRef<unknown>`），存储树节点完整自定义模板。
   */
  treeNodeFullTemplate?: TemplateRef<unknown>;
}
