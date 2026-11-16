/**
 * @fileoverview Module `src/ux/monaco-editor/editor.component.ts` providing editor component definitions and implementation.
 * @zh 模块文件 `src/ux/monaco-editor/editor.component.ts`，提供编辑器组件相关的定义与实现。
 */

import { Component, ElementRef, forwardRef, Inject, Input, NgZone, Renderer2, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { initVimMode } from 'monaco-vim';
import * as monaco from 'monaco-editor';
import { BaseEditor } from './base-editor';
import { MONACO_EDITOR_CONFIG, MonacoEditorConfig } from './config';
import { EditorModel } from './types';
import { TranslateService } from '@dotos1/dui/translator';
import { DotosConfigService, ThemeService } from '@dotos1/dui/theme';
import { EditorTheme } from './editor.theme';

// declare const monaco: any;

/**
 * Angular component `EditorComponent` (selector: 'monaco-editor') providing editor component presentation and interaction in `src/ux/monaco-editor`.
 * @zh Angular 组件 `EditorComponent`（selector: 'monaco-editor'），提供编辑器组件的视图渲染与交互逻辑（位于 `src/ux/monaco-editor`）。
 */
@Component({
  standalone: true,
  selector: 'monaco-editor',
  template: `
    <div class="editor-container" #editorContainer style="height:100%"></div>
    <div #statusbar class="statusbar"></div>
  `,
  styleUrls: ['./editor.main.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditorComponent),
    multi: true
  }],
  host: {
    style: 'padding-top: 5px;padding-bottom: 5px;',
  },
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditorComponent extends BaseEditor implements ControlValueAccessor {
  /**
   * Property `_value` (`string`) storing value (default: `''`).
   * @zh 属性 `_value`（类型：`string`），用于存储或配置值（默认值：`''`）。
   */
  private _value: string = '';
  /**
   * Property `_createdModel` (`any`) storing created model.
   * @zh 属性 `_createdModel`（类型：`any`），用于存储或配置已创建模型。
   */
  private _createdModel;
  /**
   * Template/content query reference `_statusbar` (`ElementRef<any>`) targeting statusbar.
   * @zh 模板/内容视图查询引用 `_statusbar`（`@ViewChild`），指向statusbar。
   */
  @ViewChild('statusbar', { static: true }) _statusbar: ElementRef;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Property `propagateChange` (`(_: any) => void`) storing propagate change (default: `(_: any) => {}`).
   * @zh 属性 `propagateChange`（类型：`(_: any) => void`），用于存储或配置propagate变更（默认值：`(_: any) => {}`）。
   */
  propagateChange = (_) => {};
  /**
   * Property `onTouched` (`() => void`) storing on touched (default: `() => {}`).
   * @zh 属性 `onTouched`（类型：`() => void`），用于存储或配置当是否已触碰（默认值：`() => {}`）。
   */
  onTouched = () => {};

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
      this.initMonaco(this._options, this.insideNg);
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
   * Input setter `model` updating model.
   * @zh 输入属性 `model` 的设置器，用于更新模型。
   * @param model - New model value (`EditorModel`) / 新的模型值（`EditorModel`）
   */
  @Input('model')
  set model(model: EditorModel) {
    this._options = Object.assign({}, this.config?.defaultOptions, this._options, { model });
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }

  /**
   * Gets the current monaco model (`monacoModel: monaco.editor.IModel`).
   * @zh 获取当前Monaco编辑器模型（`monacoModel: monaco.editor.IModel`）。
   */
  get monacoModel(): monaco.editor.IModel {
    if (this._editor && this._editor.getModel()) {
      return this._editor.getModel();
    }
    throw new Error('monaco editor model has not been initialized');
  }

  /**
   * Property `vimMode` (`any`) storing vim mode.
   * @zh 属性 `vimMode`（类型：`any`），用于存储或配置vim模式。
   */
  public vimMode;

  /**
   * Property `autoSizing` (`boolean`) storing auto sizing.
   * @zh 属性 `autoSizing`（类型：`boolean`），用于存储或配置自动尺寸。
   */
  autoSizing?: boolean;

  /**
   * Property `minHeight` (`number`) storing min height.
   * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度。
   */
  minHeight?: number;

  /**
   * Gets the current read only (`readOnly: boolean`).
   * @zh 获取当前读取Only（`readOnly: boolean`）。
   */
  get readOnly(): boolean {
    return this._editor.getRawOptions().readOnly;
  }

  /**
   * Sets the read only (`readOnly`).
   * @zh 设置读取Only（`readOnly`）。
   * @param readOnly - New read only value (`boolean`) / 新的读取Only值（`boolean`）
   */
  set readOnly(readOnly: boolean) {
    this.editor.updateOptions({
      readOnly: readOnly
    });
  }
  /**
   * Property `_unsubscribeAll` (`Subject<void>`) storing unsubscribe all.
   * @zh 属性 `_unsubscribeAll`（类型：`Subject<void>`），用于存储或配置取消订阅全部。
   */
  private _unsubscribeAll: Subject<void>;
  
  /**
   * Creates an instance of `EditorComponent` and initializes its dependencies and internal state.
   * @zh 创建 `EditorComponent` 实例，并初始化其依赖项与内部状态。
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param _dotosConfigService - Injected or initial dotos config service (`DotosConfigService`) / 注入或传入的DotOS配置服务（`DotosConfigService`）
   * @param editorConfig - Injected or initial editor config (`MonacoEditorConfig`) / 注入或传入的编辑器配置（`MonacoEditorConfig`）
   */
  constructor(
    private zone: NgZone, 
    public override translate: TranslateService,
    protected renderer: Renderer2,
    public themeService: ThemeService,
    private _dotosConfigService: DotosConfigService,
    @Inject(MONACO_EDITOR_CONFIG) private editorConfig: MonacoEditorConfig) {
    super(translate,editorConfig);
    this._unsubscribeAll = new Subject();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    super.ngOnInit()
    this._dotosConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.setTheme(config);
        this.themeService.loadTheme(EditorTheme);
      });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    if (this.vimMode) {
      this.vimMode.dispose();
      this.vimMode = undefined;
    }
    if (this._createdModel) {
      this._createdModel.dispose();
      this._createdModel = undefined;
    }
    super.ngOnDestroy();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Executes `setTheme` to handle set theme.
   * @zh 执行 `setTheme`，用于集合主题。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  setTheme(config) {

    let type = config.theme.type;
    let primary = config.theme.primary;
    let accent = config.theme.accent;
    let warn = config.theme.warn;
    let page = config.layout.pagemodel;
    let formType = config.theme.formType;
    this.themeService.changeTheme(primary, accent, warn, type, page, formType);
  }

  /**
   * Writes a new value from the Angular form model into the view (`ControlValueAccessor`).
   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  writeValue(value): void {
    this._value = value || '';
    setTimeout(() => {
      if (this._editor && !this.options?.model) {
        this._editor.setValue(this._value);
      }
    });
  }

  /**
   * Registers a callback function invoked when the control value changes in the UI (`ControlValueAccessor`).
   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  /**
   * Registers a callback function invoked when the control receives a blur/touched event (`ControlValueAccessor`).
   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  /**
   * Executes `setWriteMode` to handle set write mode.
   * @zh 执行 `setWriteMode`，用于集合写入模式。
   * @param type - type parameter (`any`) / 类型参数（`any`）
   */
  setWriteMode(type) {
    if (this.vimMode) {
      this.vimMode.dispose();
      this.vimMode = undefined;
    }
    if (type == 'vim') {
      this.vimMode = initVimMode(
        this._editor,
        this._statusbar?.nativeElement
      );
    }
  }
  /**
   * Executes `initMonaco` to handle init monaco.
   * @zh 执行 `initMonaco`，用于初始化Monaco编辑器。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @param insideNg - inside ng parameter (`boolean`) / 内部Angular参数（`boolean`）
   */
  public initMonaco(options, insideNg: boolean): void {
    options = Object.assign({}, this.config?.defaultOptions, options);
    const hasModel = !!options.model;

    if (hasModel) {
      const model = monaco.editor.getModel(options.model.uri || '');
      if (model) {
        if (this._createdModel && this._createdModel !== model) {
          this._createdModel.dispose();
          this._createdModel = undefined;
        }
        options.model = model;
        options.model.setValue(this._value);
      } else {
        if (this._createdModel) {
          this._createdModel.dispose();
        }
        this._createdModel = monaco.editor.createModel(options.model.value, options.model.language, options.model.uri);
        options.model = this._createdModel;
      }
    } else if (this._createdModel) {
      this._createdModel.dispose();
      this._createdModel = undefined;
    }

    if (insideNg) {
      this._editor = monaco.editor.create(
        this._editorContainer.nativeElement,
         options
        );
    } else {
      this.zone.runOutsideAngular(() => {
        this._editor = monaco.editor.create
        (this._editorContainer.nativeElement,
           options
          );
      })
    }

    if (!hasModel) {
      this._editor.setValue(this._value);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this._editor.onDidChangeModelContent((e) => {
      const value = this._editor.getValue();
      this.zone.run(() => {
        this.propagateChange(value);
        this._value = value;
      });
    });

    this._editor.onDidBlurEditorWidget(() => {
      this.onTouched();
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this._editor.layout());
    this.autoSizing = options.autoSizing || false;

    this.minHeight = options.minHeight || -1;


    this.resizeToFit();
    this.onInit.emit(this._editor);
  }

  /**
   * Gets the current editor (`editor: any`).
   * @zh 获取当前编辑器（`editor: any`）。
   */
  public get editor() {
    return this._editor;
  }
  /**
   * Executes `changeLanguage` to handle change language.
   * @zh 执行 `changeLanguage`，用于变更语言。
   * @param lang - lang parameter (`any`) / 语言参数（`any`）
   */
  public changeLanguage(lang) {
    let model = this._editor.getModel();
    monaco.editor.setModelLanguage(model, lang);
  }

  /**
   * Executes `setOptions` to handle set options.
   * @zh 执行 `setOptions`，用于集合配置选项。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   */
  setOptions(options): void {
    this.options = options;
    this.editor.updateOptions(this.options);
  }

  /**
   * Executes `setOption` to handle set option.
   * @zh 执行 `setOption`，用于集合选项。
   * @param key - key parameter (`any`) / 键参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  setOption(key,value){
    this.options[key]=value;
    this.editor.updateOptions(this.options);
  }

  /**
   * Executes `getLine` to handle get line.
   * @zh 执行 `getLine`，用于获取线段。
   * @param line - line parameter (`number`) / 线段参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getLine(line: number): string | undefined {
    return this.monacoModel.getLineContent(line + 1);
  }

  /**
   * Executes `getOffsetAt` to handle get offset at.
   * @zh 执行 `getOffsetAt`，用于获取偏移量位于。
   * @param position - position parameter (`any`) / 位置参数（`any`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getOffsetAt(position): number {
    return this.monacoModel.getOffsetAt(
      this.toMonacoPosition(position)
    );
  }

  /**
   * Executes `getPositionAt` to handle get position at.
   * @zh 执行 `getPositionAt`，用于获取位置位于。
   * @param offset - offset parameter (`number`) / 偏移量参数（`number`）
   * @returns Result of type `{ line: number; column: number; }` / 类型为 `{ line: number; column: number; }` 的返回值
   */
  getPositionAt(offset: number) {
    return this.toPosition(this.monacoModel.getPositionAt(offset));
  }

  /**
   * Executes `undo` to handle undo.
   * @zh 执行 `undo`，用于撤销。
   */
  undo(): void {

    this.editor.getModel().undo();
  }

  /**
   * Executes `redo` to handle redo.
   * @zh 执行 `redo`，用于重做。
   */
  redo(): void {

    this.editor.getModel().redo();
  }
  /**
   * Executes `find` to handle find.
   * @zh 执行 `find`，用于查找。
   */
  find(){
    this.editor.focus(); 
     this.editor.getAction('actions.find').run();
  }
  /**
   * Executes `goToLine` to handle go to line.
   * @zh 执行 `goToLine`，用于跳转到转换为线段。
   */
  goToLine(){
    this.editor.focus(); 
      this.editor.getAction('editor.action.gotoLine').run().then(()=>{
        this.editor.setPosition({ column: 1, lineNumber: 1 });
      });
  }

  /**
   * Executes `clearHistory` to handle clear history.
   * @zh 执行 `clearHistory`，用于清空历史记录。
   */
  clearHistory(): void {
    this.monacoModel.setValue(this.monacoModel.getValue());
  }

  /**
   * Executes `focus` to handle focus.
   * @zh 执行 `focus`，用于聚焦。
   */
  focus(): void {
    this._editor.focus();
  }

  /**
   * Executes `hasFocus` to handle has focus.
   * @zh 执行 `hasFocus`，用于是否包含聚焦。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  hasFocus(): boolean {
    return false;
  }

  /**
   * Executes `blur` to handle blur.
   * @zh 执行 `blur`，用于失焦。
   */
  blur(): void {
    // this._editor.blur();
  }

  /**
   * Executes `refresh` to handle refresh.
   * @zh 执行 `refresh`，用于刷新。
   */
  refresh(): void {
    this.autoresize();
  }

  /**
   * Executes `resizeToFit` to handle resize to fit.
   * @zh 执行 `resizeToFit`，用于调整尺寸转换为适配。
   */
  resizeToFit(): void {
    this.autoresize();
  }

  /**
   * Executes `autoresize` to handle autoresize.
   * @zh 执行 `autoresize`，用于autoresize。
   */
  public autoresize(): void {
    if (this.autoSizing) {
      this.resize(null);
    }
  }

  /**
   * Executes `getHostNode` to handle get host node.
   * @zh 执行 `getHostNode`，用于获取宿主节点。
   * @returns Result of type `HTMLElement` / 类型为 `HTMLElement` 的返回值
   */
  public getHostNode(): HTMLElement | undefined {
    const domNode = this._editor.getDomNode();

    return domNode ? domNode.parentElement : undefined;
  }

  /**
   * Gets the current line count (`lineCount: number`).
   * @zh 获取当前线段计数（`lineCount: number`）。
   */
  get lineCount(): number {
    return this.monacoModel.getLineCount();
  }

  /**
   * Executes `getWidth` to handle get width.
   * @zh 执行 `getWidth`，用于获取宽度。
   * @param hostNode - host node parameter (`HTMLElement`) / 宿主节点参数（`HTMLElement`）
   * @param boxSizing - box sizing parameter (`any`) / 盒子容器尺寸参数（`any`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  public getWidth(hostNode: HTMLElement, boxSizing): number {
    return hostNode.offsetWidth - boxSizing.horizontalSum;
  }
  /**
   * Executes `getHeight` to handle get height.
   * @zh 执行 `getHeight`，用于获取高度。
   * @param hostNode - host node parameter (`HTMLElement`) / 宿主节点参数（`HTMLElement`）
   * @param boxSizing - box sizing parameter (`any`) / 盒子容器尺寸参数（`any`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  public getHeight(hostNode: HTMLElement, boxSizing): number {
    return hostNode.offsetHeight - boxSizing.verticalSum;
  }

  // public getHeight(hostNode: HTMLElement, boxSizing: any): number {
  //   if (!this.autoSizing) {
  //     return hostNode.offsetHeight - boxSizing.verticalSum;
  //   }

  //   const configuration = this.editor.getRawOptions();

  //   const lineHeight = configuration.lineHeight;
  //   const lineCount = this.lineCount;
  //   const contentHeight = lineHeight * lineCount;

  //   const horizontalScrollbarHeight =this.editor.getOptions().get(monaco.editor.EditorOption.layoutInfo).horizontalScrollbarHeight;
  //   const editorHeight = contentHeight + horizontalScrollbarHeight;
  //   if (this.minHeight < 0) {
  //     return editorHeight;
  //   }
  //   const defaultHeight =  lineHeight * this.minHeight + horizontalScrollbarHeight;
  //   return Math.max(defaultHeight, editorHeight);
  // }


  /**
   * Executes `boxSizing` to handle box sizing.
   * @zh 执行 `boxSizing`，用于盒子容器尺寸。
   * @param element - element parameter (`Element`) / 元素参数（`Element`）
   * @returns Result of type `{…}` / 类型为 `{…}` 的返回值
   */
  protected boxSizing(element: Element) {
    let style = window.getComputedStyle(element);
    let bt = parseFloat(style.borderTopWidth) || 0;
    let bl = parseFloat(style.borderLeftWidth) || 0;
    let br = parseFloat(style.borderRightWidth) || 0;
    let bb = parseFloat(style.borderBottomWidth) || 0;
    let pt = parseFloat(style.paddingTop) || 0;
    let pl = parseFloat(style.paddingLeft) || 0;
    let pr = parseFloat(style.paddingRight) || 0;
    let pb = parseFloat(style.paddingBottom) || 0;
    let hs = bl + pl + pr + br;
    let vs = bt + pt + pb + bb;
    return {
      borderTop: bt,
      borderLeft: bl,
      borderRight: br,
      borderBottom: bb,
      paddingTop: pt,
      paddingLeft: pl,
      paddingRight: pr,
      paddingBottom: pb,
      horizontalSum: hs,
      verticalSum: vs,
    };
  }

  /**
   * Executes `computeLayoutSize` to handle compute layout size.
   * @zh 执行 `computeLayoutSize`，用于计算布局尺寸。
   * @param hostNode - host node parameter (`HTMLElement`) / 宿主节点参数（`HTMLElement`）
   * @param dimension - dimension parameter (`monaco.editor.IDimension`) / 维度参数（`monaco.editor.IDimension`）
   * @returns Result of type `monaco.editor.IDimension` / 类型为 `monaco.editor.IDimension` 的返回值
   */
  public computeLayoutSize(
    hostNode: HTMLElement,
    dimension: monaco.editor.IDimension | null
  ): monaco.editor.IDimension {
    if (dimension && dimension.width >= 0 && dimension.height >= 0) {
      return dimension;
    }
    const boxSizing = this.boxSizing(hostNode);

    const width =
      !dimension || dimension.width < 0
        ? this.getWidth(hostNode, boxSizing)
        : dimension.width;

    const height =
      !dimension || dimension.height < 0
        ? this.getHeight(hostNode, boxSizing)
        : dimension.height;

    return { width, height };
  }

  /**
   * Executes `resize` to handle resize.
   * @zh 执行 `resize`，用于调整尺寸。
   * @param dimension - dimension parameter (`monaco.editor.IDimension`) / 维度参数（`monaco.editor.IDimension`）
   */
  public resize(dimension: monaco.editor.IDimension | null): void {
    const hostNode = this.getHostNode();

    if (hostNode) {
      const layoutSize = this.computeLayoutSize(hostNode, dimension);

      this.editor.layout(layoutSize);
    }
  }

  /**
   * Executes `toMonacoPosition` to handle to monaco position.
   * @zh 执行 `toMonacoPosition`，用于转换为Monaco编辑器位置。
   * @param position - position parameter (`any`) / 位置参数（`any`）
   * @returns Result of type `monaco.IPosition` / 类型为 `monaco.IPosition` 的返回值
   */
  private toMonacoPosition(position): monaco.IPosition {
    return {
      lineNumber: position.line + 1,
      column: position.column + 1,
    };
  }

  /**
   * Executes `toPosition` to handle to position.
   * @zh 执行 `toPosition`，用于转换为位置。
   * @param position - position parameter (`monaco.Position`) / 位置参数（`monaco.Position`）
   * @returns Result of type `{ line: number; column: number; }` / 类型为 `{ line: number; column: number; }` 的返回值
   */
  private toPosition(position: monaco.Position) {
    return {
      line: position.lineNumber - 1,
      column: position.column - 1,
    };
  }
}