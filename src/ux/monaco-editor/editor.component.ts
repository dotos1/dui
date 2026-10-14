import { Component, ElementRef, forwardRef, Inject, Input, NgZone, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { initVimMode } from 'monaco-vim';
import * as monaco from 'monaco-editor';
import { BaseEditor } from './base-editor';
import { MONACO_EDITOR_CONFIG, MonacoEditorConfig } from './config';
import { EditorModel } from './types';
import { TranslateService } from '@dotos/dui/translator';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';
import { EditorTheme } from './editor.theme';

// declare const monaco: any;

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
})
export class EditorComponent extends BaseEditor implements ControlValueAccessor {
  private _value: string = '';
  private _createdModel: any;
  @ViewChild('statusbar', { static: true }) _statusbar: ElementRef;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  propagateChange = (_: any) => {};
  onTouched = () => {};

  @Input('options')
  set options(options: any) {
    this._options = Object.assign({}, this.config.defaultOptions, options);
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }

  get options(): any {
    return this._options;
  }

  @Input('model')
  set model(model: EditorModel) {
    this._options = Object.assign({}, this.config?.defaultOptions, this._options, { model });
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }

  get monacoModel(): monaco.editor.IModel {
    if (this._editor && this._editor.getModel()) {
      return this._editor.getModel();
    }
    throw new Error('monaco editor model has not been initialized');
  }

  public vimMode;

  autoSizing?: boolean;

  minHeight?: number;

  get readOnly(): boolean {
    return this._editor.getRawOptions().readOnly;
  }

  set readOnly(readOnly: boolean) {
    this.editor.updateOptions({
      readOnly: readOnly
    });
  }
  private _unsubscribeAll: Subject<void>;
  
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

  override ngOnInit() {
    super.ngOnInit()
    this._dotosConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.setTheme(config);
        this.themeService.loadTheme(EditorTheme);
      });
  }

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

  setTheme(config) {

    let type = config.theme.type;
    let primary = config.theme.primary;
    let accent = config.theme.accent;
    let warn = config.theme.warn;
    let page = config.layout.pagemodel;
    let formType = config.theme.formType;
    this.themeService.changeTheme(primary, accent, warn, type, page, formType);
  }

  writeValue(value: any): void {
    this._value = value || '';
    setTimeout(() => {
      if (this._editor && !this.options?.model) {
        this._editor.setValue(this._value);
      }
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

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
  public initMonaco(options: any, insideNg: boolean): void {
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
    this._editor.onDidChangeModelContent((e: any) => {
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

  public get editor() {
    return this._editor;
  }
  public changeLanguage(lang) {
    let model = this._editor.getModel();
    monaco.editor.setModelLanguage(model, lang);
  }

  setOptions(options: any): void {
    this.options = options;
    this.editor.updateOptions(this.options);
  }

  setOption(key,value){
    this.options[key]=value;
    this.editor.updateOptions(this.options);
  }

  getLine(line: number): string | undefined {
    return this.monacoModel.getLineContent(line + 1);
  }

  getOffsetAt(position: any): number {
    return this.monacoModel.getOffsetAt(
      this.toMonacoPosition(position)
    );
  }

  getPositionAt(offset: number): any {
    return this.toPosition(this.monacoModel.getPositionAt(offset));
  }

  undo(): void {

    this.editor.getModel().undo();
  }

  redo(): void {

    this.editor.getModel().redo();
  }
  find(){
    this.editor.focus(); 
     this.editor.getAction('actions.find').run();
  }
  goToLine(){
    this.editor.focus(); 
      this.editor.getAction('editor.action.gotoLine').run().then(()=>{
        this.editor.setPosition({ column: 1, lineNumber: 1 });
      });
  }

  clearHistory(): void {
    this.monacoModel.setValue(this.monacoModel.getValue());
  }

  focus(): void {
    this._editor.focus();
  }

  hasFocus(): boolean {
    return false;
  }

  blur(): void {
    // this._editor.blur();
  }

  refresh(): void {
    this.autoresize();
  }

  resizeToFit(): void {
    this.autoresize();
  }

  public autoresize(): void {
    if (this.autoSizing) {
      this.resize(null);
    }
  }

  public getHostNode(): HTMLElement | undefined {
    const domNode = this._editor.getDomNode();

    return domNode ? domNode.parentElement : undefined;
  }

  get lineCount(): number {
    return this.monacoModel.getLineCount();
  }

  public getWidth(hostNode: HTMLElement, boxSizing: any): number {
    return hostNode.offsetWidth - boxSizing.horizontalSum;
  }
  public getHeight(hostNode: HTMLElement, boxSizing: any): number {
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


  protected boxSizing(element: Element): any {
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

  public resize(dimension: monaco.editor.IDimension | null): void {
    const hostNode = this.getHostNode();

    if (hostNode) {
      const layoutSize = this.computeLayoutSize(hostNode, dimension);

      this.editor.layout(layoutSize);
    }
  }

  private toMonacoPosition(position: any): monaco.IPosition {
    return {
      lineNumber: position.line + 1,
      column: position.column + 1,
    };
  }

  private toPosition(position: monaco.Position): any {
    return {
      line: position.lineNumber - 1,
      column: position.column - 1,
    };
  }
}