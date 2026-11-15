/**
 * @fileoverview Module `src/ux/monaco-editor/diff-editor.component.ts` providing diff editor component definitions and implementation.
 * @zh 模块文件 `src/ux/monaco-editor/diff-editor.component.ts`，提供diff编辑器组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Inject, Input, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs';
import { BaseEditor } from './base-editor';
import { DiffEditorModel } from './types';
import { TranslateService } from '@dotos1/dui/translator';
import { MONACO_EDITOR_CONFIG, MonacoEditorConfig } from './config';

/**
 * Constant/variable `monaco` defining monaco in `src/ux/monaco-editor`.
 * @zh 常量/变量 `monaco`，定义 `src/ux/monaco-editor` 中的Monaco编辑器。
 */
declare const monaco;
   
/**
 * Angular component `DiffEditorComponent` (selector: 'monaco-diff-editor') providing diff editor component presentation and interaction in `src/ux/monaco-editor`.
 * @zh Angular 组件 `DiffEditorComponent`（selector: 'monaco-diff-editor'），提供Diff编辑器组件的视图渲染与交互逻辑（位于 `src/ux/monaco-editor`）。
 */
@Component({
  standalone: true,
  selector: 'monaco-diff-editor',
  template: '<div class="editor-container" #editorContainer></div>',
  styles: [`
    :host {
      display: block;
      height: 200px;
    }

    .editor-container {
      width: 100%;
      height: 98%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiffEditorComponent extends BaseEditor {


  /**
   * Property `_originalModel` (`DiffEditorModel`) storing original model.
   * @zh 属性 `_originalModel`（类型：`DiffEditorModel`），用于存储或配置原始模型。
   */
  _originalModel: DiffEditorModel;
  /**
   * Property `_modifiedModel` (`DiffEditorModel`) storing modified model.
   * @zh 属性 `_modifiedModel`（类型：`DiffEditorModel`），用于存储或配置modified模型。
   */
  _modifiedModel: DiffEditorModel;
  /**
   * Property `_createdOriginalModel` (`any`) storing created original model.
   * @zh 属性 `_createdOriginalModel`（类型：`any`），用于存储或配置已创建原始模型。
   */
  private _createdOriginalModel;
  /**
   * Property `_createdModifiedModel` (`any`) storing created modified model.
   * @zh 属性 `_createdModifiedModel`（类型：`any`），用于存储或配置已创建Modified模型。
   */
  private _createdModifiedModel;

  /**
   * Input setter `options` updating options.
   * @zh 输入属性 `options` 的设置器，用于更新配置选项。
   * @param options - New options value (`any`) / 新的配置选项值（`any`）
   */
  @Input('options')
  set options(options) {
    this._options = Object.assign({}, this.config.defaultOptions, options);
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(options, this.insideNg);
    }
  }

  /**
   * Gets the current options (`options: any`).
   * @zh 获取当前配置选项（`options: any`）。
   */
  get options() {
    return this._options;
  }

  /**
   * Input setter `originalModel` updating original model.
   * @zh 输入属性 `originalModel` 的设置器，用于更新原始模型。
   * @param model - New original model value (`DiffEditorModel`) / 新的原始模型值（`DiffEditorModel`）
   */
  @Input('originalModel')
  set originalModel(model: DiffEditorModel) {
    this._originalModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }

  /**
   * Input setter `modifiedModel` updating modified model.
   * @zh 输入属性 `modifiedModel` 的设置器，用于更新modified模型。
   * @param model - New modified model value (`DiffEditorModel`) / 新的modified模型值（`DiffEditorModel`）
   */
  @Input('modifiedModel')
  set modifiedModel(model: DiffEditorModel) {
    this._modifiedModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }


  /**
   * Creates an instance of `DiffEditorComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DiffEditorComponent` 实例，并初始化其依赖项与内部状态。
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param editorConfig - Injected or initial editor config (`MonacoEditorConfig`) / 注入或传入的编辑器配置（`MonacoEditorConfig`）
   */
  constructor(private zone: NgZone, 
    public override translate: TranslateService,
    @Inject(MONACO_EDITOR_CONFIG) private editorConfig: MonacoEditorConfig) {
    super(translate,editorConfig);
  }


  /**
   * Executes `initMonaco` to handle init monaco.
   * @zh 执行 `initMonaco`，用于初始化Monaco编辑器。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @param insideNg - inside ng parameter (`boolean`) / 内部Angular参数（`boolean`）
   */
  protected initMonaco(options, insideNg: boolean): void {

    if (!this._originalModel || !this._modifiedModel) {
      throw new Error('originalModel or modifiedModel not found for ngx-monaco-diff-editor');
    }

    this._originalModel.language = this._originalModel.language || options.language;
    this._modifiedModel.language = this._modifiedModel.language || options.language;

    // 上一轮 initMonaco() 创建的模型没有存过引用也没有 dispose 过；
    // editor.dispose() 只销毁 diff editor 控件本身，createModel() 单独
    // 创建的文本模型会一直留在 Monaco 的全局模型注册表里
    this._disposeModels();
    this._createdOriginalModel = monaco.editor.createModel(this._originalModel.code, this._originalModel.language);
    this._createdModifiedModel = monaco.editor.createModel(this._modifiedModel.code, this._modifiedModel.language);

    this._editorContainer.nativeElement.innerHTML = '';
    const theme = options.theme;

    if (insideNg) {
      this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
    } else {
      this.zone.runOutsideAngular(() => {
        this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
      })
    }

    options.theme = theme;
    this._editor.setModel({
      original: this._createdOriginalModel,
      modified: this._createdModifiedModel
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this._editor.layout());
    this.onInit.emit(this._editor);
  }

  /**
   * Executes `_disposeModels` to handle dispose models.
   * @zh 执行 `_disposeModels`，用于释放模型集合。
   */
  private _disposeModels(): void {
    this._createdOriginalModel?.dispose();
    this._createdModifiedModel?.dispose();
    this._createdOriginalModel = undefined;
    this._createdModifiedModel = undefined;
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy(): void {
    this._disposeModels();
    super.ngOnDestroy();
  }

}