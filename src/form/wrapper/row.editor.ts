/**
 * @fileoverview Module `src/form/wrapper/row.editor.ts` providing row editor definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/row.editor.ts`，提供行编辑器相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Inject,Optional } from '@angular/core';
import { FieldArrayType, FormBuilder, FormConfig } from '@dotos1/dui/core/form';

/**
 * Angular component `RowEditorComponent` (selector: 'row-editor') providing row editor component presentation and interaction in `src/form/wrapper`.
 * @zh Angular 组件 `RowEditorComponent`（selector: 'row-editor'），提供行编辑器组件的视图渲染与交互逻辑（位于 `src/form/wrapper`）。
 */
@Component({
  selector: 'row-editor',
  templateUrl: './row.editor.html',
  styleUrls: ['./row.editor.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  host: { 
    hostID: 'row-editor' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
export class RowEditorComponent extends FieldArrayType {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Creates an instance of `RowEditorComponent` and initializes its dependencies and internal state.
   * @zh 创建 `RowEditorComponent` 实例，并初始化其依赖项与内部状态。
   * @param builder - Injected or initial builder (`FormBuilder`) / 注入或传入的构建器（`FormBuilder`）
   */
  constructor(@Inject(FormConfig) @Optional() builder?: FormBuilder) {
    super();
  }
  /**
   * Executes `add` to handle add.
   * @zh 执行 `add`，用于添加。
   */
  override add() {
    super.add();
  }
  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param i - i parameter (`number`) / i参数（`number`）
   */
  override remove(i: number) {
    super.remove(i);
  }
}
