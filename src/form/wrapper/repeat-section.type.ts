/**
 * @fileoverview Module `src/form/wrapper/repeat-section.type.ts` providing repeat section type definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/repeat-section.type.ts`，提供repeatsection类型相关的定义与实现。
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Optional, ViewChild } from '@angular/core';
import { FieldArrayType, FormBuilder, FORM_CONFIG } from '@dotos/dui/core/form';
import { ButtonComponent } from '@dotos/dui/ui/button';

/**
 * Angular component `RepeatTypeComponent` (selector: 'repeat-section') providing repeat type component presentation and interaction in `src/form/wrapper`.
 * @zh Angular 组件 `RepeatTypeComponent`（selector: 'repeat-section'），提供Repeat类型组件的视图渲染与交互逻辑（位于 `src/form/wrapper`）。
 */
@Component({
  selector: 'repeat-section',
  templateUrl: './repeat-section.type.html',
  styleUrls: ['./repeat-section.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'repeat-section' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
export class RepeatTypeComponent extends FieldArrayType {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `change` to handle change.
   * @zh 执行 `change`，用于变更。
   * @param val - val parameter (`any`) / 值参数（`any`）
   */
  public change(val) { };

  /**
   * Template/content query reference `addButton` (`ButtonComponent`) targeting add button.
   * @zh 模板/内容视图查询引用 `addButton`（`@ViewChild`），指向添加按钮。
   */
  @ViewChild(ButtonComponent) addButton: ButtonComponent;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Creates an instance of `RepeatTypeComponent` and initializes its dependencies and internal state.
   * @zh 创建 `RepeatTypeComponent` 实例，并初始化其依赖项与内部状态。
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param builder - Injected or initial builder (`FormBuilder`) / 注入或传入的构建器（`FormBuilder`）
   */
  constructor(protected _changeDetectorRef: ChangeDetectorRef,@Inject(FORM_CONFIG) @Optional() builder?: FormBuilder) {
    super();
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param conf - conf parameter (`any`) / conf参数（`any`）
   */
  public override init(conf?): void {
    if (conf.change) {
      this.change = conf.change;
    }
  }

  /**
   * Executes `add` to handle add.
   * @zh 执行 `add`，用于添加。
   * @param model - model parameter (`any`) / 模型参数（`any`）
   */
  override add(model) {
    super.add(undefined, model);
    this.change({ type: 'add', data: model });
    this._changeDetectorRef.markForCheck();
  }
  /**
   * Executes `setName` to handle set name.
   * @zh 执行 `setName`，用于集合名称。
   * @param i - i parameter (`any`) / i参数（`any`）
   * @param name - name parameter (`any`) / 名称参数（`any`）
   */
  setName(i,name){
    this.model[i].name =name;
    this._changeDetectorRef.markForCheck();
  }
  /**
   * Executes `getTitle` to handle get title.
   * @zh 执行 `getTitle`，用于获取标题。
   * @param i - i parameter (`any`) / i参数（`any`）
   */
  getTitle(i) {
    return this.model[i].name ? this.model[i].name : this.model[i].title;
  }
  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param i - i parameter (`number`) / i参数（`number`）
   */
  override remove(i: number) {
    this.change({ type: 'delete', index: i });
    super.remove(i);
    this._changeDetectorRef.markForCheck();
  }
}
