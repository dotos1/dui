/**
 * @fileoverview Module `src/ux/jsonEditor/json.editor.ts` providing json editor definitions and implementation.
 * @zh 模块文件 `src/ux/jsonEditor/json.editor.ts`，提供JSON编辑器相关的定义与实现。
 */

import { Component,  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from '@dotos/dui/common/toastr';
import { EditorComponent } from '@dotos/dui/ux/monaco-editor';

/**
 * Angular component `JsonEditor` (selector: 'json-editor') providing json editor presentation and interaction in `src/ux/jsonEditor`.
 * @zh Angular 组件 `JsonEditor`（selector: 'json-editor'），提供JSON编辑器的视图渲染与交互逻辑（位于 `src/ux/jsonEditor`）。
 */
@Component({
  selector: 'json-editor',
  template: `
  <card #codeContainer [config]="cardConfig">
    <monaco-editor class="monaco-editor"
      [options]="editorOptions"
      [(ngModel)]="codeValue"  fxFlexFill  fxFlex style="overflow:hidden" >
    </monaco-editor>
  </card>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'flex:1;display:flex;flex-direction:column;height: 100%;',
    
  },
  styles: [`
          :host ::ng-deep   .monaco-editor {
          width:100%;
        }
        :host ::ng-deep      .codeContainer .mat-mdc-card-content{
          padding: 2px;
        }
        :host ::ng-deep  .monaco-editor{
        outline-width: 0px !important;
      }
      :host ::ng-deep .mat-mdc-card-title{
        padding-bottom: 10px !important;
        padding-top: 10px !important;
      }
      :host ::ng-deep  .mdc-card__actions{
        min-height:56px;
      }
  `]
})
export class JsonEditor {

  /**
   * Template/content query reference `monacoEditor` (`EditorComponent`) targeting monaco editor.
   * @zh 模板/内容视图查询引用 `monacoEditor`（`@ViewChild`），指向Monaco编辑器编辑器。
   */
  @ViewChild(EditorComponent)
  monacoEditor: EditorComponent;

  /**
   * Property `codeValue` (`string`) storing code value (default: `''`).
   * @zh 属性 `codeValue`（类型：`string`），用于存储或配置编码值（默认值：`''`）。
   */
  codeValue: string = '';

  /**
   * Property `parent` (`any`) storing parent.
   * @zh 属性 `parent`（类型：`any`），用于存储或配置父级。
   */
  parent;

  /**
   * Property `editorOptions` (`{…}`) storing editor options.
   * @zh 属性 `editorOptions`（类型：`{…}`），用于存储或配置编辑器配置选项。
   */
  editorOptions = {
    language: "json",
    autoIndent: 'full',
    smoothScrolling: true,
    minimap: {
      enabled: false
    },
    scrollbar: {
      horizontal: 'visible',
      horizontalHasArrows: true,
      vertical: 'visible',
      verticalHasArrows: true
    }
  };
  /**
   * Property `buttons` (`({…})[]`) storing buttons.
   * @zh 属性 `buttons`（类型：`({…})[]`），用于存储或配置按钮。
   */
  private buttons = [
    {
      xtype: "dui-button",
      type: 'mat-button',
      color: 'accent',
      name: 'confirm',
      text: 'UX.OK',
      disable: false,
      handler: () => {
        this.save();
      }
    },
    {
      xtype: "dui-button",
      type: 'mat-button',
      name: 'cancel',
      text: 'UX.CANCEL',
      handler: () => {
        this.dialogRef.close()
      }
    },
  ];

  /**
   * Property `cardConfig` (`{…}`) storing card config.
   * @zh 属性 `cardConfig`（类型：`{…}`），用于存储或配置卡片配置。
   */
  cardConfig = {
    xtype: 'card',
    title: 'UX.JSONCODE',
    fxLayout: 'row',
    buttons: this.buttons
  }
  /**
   * Creates an instance of `JsonEditor` and initializes its dependencies and internal state.
   * @zh 创建 `JsonEditor` 实例，并初始化其依赖项与内部状态。
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param toastr - Injected or initial toastr (`ToastrService`) / 注入或传入的轻提示（`ToastrService`）
   * @param data - Injected or initial data (`any`) / 注入或传入的数据（`any`）
   * @param dialogRef - Injected or initial dialog ref (`MatDialogRef<JsonEditor, any>`) / 注入或传入的对话框引用（`MatDialogRef<JsonEditor, any>`）
   * @param _apiBase - Injected or initial api base (`string`) / 注入或传入的API接口基础（`string`）
   */
  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data,
    public dialogRef: MatDialogRef<JsonEditor>,
    @Inject('apiBase') private _apiBase: string) {
    this.codeValue = JSON.stringify(data.codeValue, undefined, 4);
    this.parent = data.parent;
  }

  /**
   * Executes `save` to handle save.
   * @zh 执行 `save`，用于保存。
   */
  save() {
    try {
      let json = JSON.parse(this.codeValue);
      this.parent.save(json);
      this.dialogRef.close();
    } catch (e) {
      this.toastr?.error(e?.message || 'Invalid JSON');
    }
  }
};
