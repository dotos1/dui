/**
 * @fileoverview Module `src/ux/code-editor/code-editor.component.ts` providing code editor component definitions and implementation.
 * @zh 模块文件 `src/ux/code-editor/code-editor.component.ts`，提供编码编辑器组件相关的定义与实现。
 */

import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, forwardRef, NgZone } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

/**
 * Constant/variable `noop` defining noop in `src/ux/code-editor`.
 * @zh 常量/变量 `noop`，定义 `src/ux/code-editor` 中的noop。
 */
const noop = () => {
  // empty method
};

// counter for ids to allow for multiple editors on one page
/**
 * Constant/variable `uniqueCounter` defining unique counter in `src/ux/code-editor`.
 * @zh 常量/变量 `uniqueCounter`，定义 `src/ux/code-editor` 中的唯一计数器。
 */
let uniqueCounter: number = 0;
/**
 * Constant/variable `loadedMonaco` defining loaded monaco in `src/ux/code-editor`.
 * @zh 常量/变量 `loadedMonaco`，定义 `src/ux/code-editor` 中的已加载Monaco编辑器。
 */
let loadedMonaco: boolean = false;
/**
 * Constant/variable `loadPromise` defining load promise in `src/ux/code-editor`.
 * @zh 常量/变量 `loadPromise`，定义 `src/ux/code-editor` 中的加载Promise。
 */
let loadPromise: Promise<void>;
/**
 * Constant/variable `monaco` defining monaco in `src/ux/code-editor`.
 * @zh 常量/变量 `monaco`，定义 `src/ux/code-editor` 中的Monaco编辑器。
 */
declare const monaco;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Constant/variable `require` defining require in `src/ux/code-editor`.
 * @zh 常量/变量 `require`，定义 `src/ux/code-editor` 中的require。
 */
declare const require;

/**
 * Angular component `ExtCodeEditorComponent` (selector: 'td-code-editor') providing ext code editor component presentation and interaction in `src/ux/code-editor`.
 * @zh Angular 组件 `ExtCodeEditorComponent`（selector: 'td-code-editor'），提供Ext编码编辑器组件的视图渲染与交互逻辑（位于 `src/ux/code-editor`）。
 */
@Component({
  selector: 'td-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: [ './code-editor.component.scss' ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ExtCodeEditorComponent),
    multi: true,
  }],
  
})
export class ExtCodeEditorComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  /**
   * Property `_editorStyle` (`string`) storing editor style.
   * @zh 属性 `_editorStyle`（类型：`string`），用于存储或配置编辑器样式。
   */
  private _editorStyle: string = 'width:100%;height:100%;border:1px solid grey;';
  /**
   * Property `_value` (`string`) storing value (default: `''`).
   * @zh 属性 `_value`（类型：`string`），用于存储或配置值（默认值：`''`）。
   */
  private _value: string = '';
  /**
   * Property `_theme` (`string`) storing theme (default: `'vs'`).
   * @zh 属性 `_theme`（类型：`string`），用于存储或配置主题（默认值：`'vs'`）。
   */
  private _theme: string = 'vs';
  /**
   * Property `_language` (`string`) storing language (default: `'javascript'`).
   * @zh 属性 `_language`（类型：`string`），用于存储或配置语言（默认值：`'javascript'`）。
   */
  private _language: string = 'javascript';
  /**
   * Property `_subject` (`Subject<string>`) storing subject (default: `new Subject()`).
   * @zh 属性 `_subject`（类型：`Subject<string>`），用于存储或配置主题流（默认值：`new Subject()`）。
   */
  private _subject: Subject<string> = new Subject();
  /**
   * Property `_editorInnerContainer` (`string`) storing editor inner container.
   * @zh 属性 `_editorInnerContainer`（类型：`string`），用于存储或配置编辑器内部容器。
   */
  private _editorInnerContainer: string = 'editorInnerContainer' + uniqueCounter++;
  /**
   * Property `_editor` (`any`) storing editor.
   * @zh 属性 `_editor`（类型：`any`），用于存储或配置编辑器。
   */
  private _editor;
  /**
   * Property `_componentInitialized` (`boolean`) storing component initialized (default: `false`).
   * @zh 属性 `_componentInitialized`（类型：`boolean`），用于存储或配置组件已初始化（默认值：`false`）。
   */
  private _componentInitialized: boolean = false;
  /**
   * Property `_fromEditor` (`boolean`) storing from editor (default: `false`).
   * @zh 属性 `_fromEditor`（类型：`boolean`），用于存储或配置从编辑器（默认值：`false`）。
   */
  private _fromEditor: boolean = false;
  /**
   * Property `_automaticLayout` (`boolean`) storing automatic layout (default: `false`).
   * @zh 属性 `_automaticLayout`（类型：`boolean`），用于存储或配置automatic布局（默认值：`false`）。
   */
  private _automaticLayout: boolean = false;
  /**
   * Property `_editorOptions` (`any`) storing editor options (default: `{}`).
   * @zh 属性 `_editorOptions`（类型：`any`），用于存储或配置编辑器配置选项（默认值：`{}`）。
   */
  private _editorOptions: Record<string, unknown> = {};

  /**
   * Template/content query reference `_editorContainer` (`@ViewChild`) targeting editor container.
   * @zh 模板/内容视图查询引用 `_editorContainer`（`@ViewChild`），指向编辑器容器。
   */
  @ViewChild('editorContainer') _editorContainer: ElementRef;

 /**
  * editorInitialized: function($event)
  * Event emitted when editor is first initialized

  * @zh 输出事件 `editorInitialized`（类型：`EventEmitter<void>`），当触发当编辑器已初始化时向外发出事件。
  */
  @Output('editorInitialized') onEditorInitialized: EventEmitter<void> = new EventEmitter<void>();

 /**
  * editorConfigurationChanged: function($event)
  * Event emitted when editor's configuration changes

  * @zh 输出事件 `editorConfigurationChanged`（类型：`EventEmitter<void>`），当触发当编辑器配置项已变更时向外发出事件。
  */
  @Output('editorConfigurationChanged') onEditorConfigurationChanged: EventEmitter<void> = new EventEmitter<void>();

 /**
  * editorLanguageChanged: function($event)
  * Event emitted when editor's Language changes

  * @zh 输出事件 `editorLanguageChanged`（类型：`EventEmitter<void>`），当触发当编辑器语言已变更时向外发出事件。
  */
  @Output('editorLanguageChanged') onEditorLanguageChanged: EventEmitter<void> = new EventEmitter<void>();

 /**
  * editorValueChange: function($event)
  * Event emitted any time something changes the editor value

  * @zh 输出事件 `editorValueChange`（类型：`EventEmitter<void>`），当触发当编辑器值变更时向外发出事件。
  */
  @Output('editorValueChange') onEditorValueChange: EventEmitter<void> = new EventEmitter<void>();

  /**
   * The change event notifies you about a change happening in an input field.
   * Since the component is not a native Angular component have to specifiy the event emitter ourself

   * @zh 输出事件 `change`（类型：`EventEmitter<void>`），当触发当变更时向外发出事件。
   */
  @Output('change') onChange: EventEmitter<void> = new EventEmitter<void>();
  /* tslint:disable-next-line */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Property `propagateChange` (`any`) storing propagate change (default: `(_: any) => {}`).
   * @zh 属性 `propagateChange`（类型：`any`），用于存储或配置propagate变更（默认值：`(_: any) => {}`）。
   */
  propagateChange = (_) => {};
  /**
   * Property `onTouched` (`any`) storing on touched (default: `() => noop`).
   * @zh 属性 `onTouched`（类型：`any`），用于存储或配置当是否已触碰（默认值：`() => noop`）。
   */
  onTouched = () => noop;

  /**
   * Set if using Electron mode when object is created

   * @zh 创建 `ExtCodeEditorComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor(private zone: NgZone) {
    // since accessing the window object need this check so serverside rendering doesn't fail
  }

  /**
   * value?: string
   * Value in the Editor after async getEditorContent was called

   * @zh 输入属性 `value` 的设置器，用于更新值。
   */
  @Input('value')
  set value(value: string) {
    this._value = value;
    if (this._componentInitialized) {
        if (this._editor) {
            // don't want to keep sending content if event came from the editor, infinite loop
            if (!this._fromEditor) {
                this._editor.setValue(value);
            }
            this.onEditorValueChange.emit(undefined);
            this.propagateChange(this._value);
            this.onChange.emit(undefined);
            this._fromEditor = false;
            this.zone.run(() => this._value = value);
        }
    }
  }

  /**
   * Gets the current value (`value: string`).
   * @zh 获取当前值（`value: string`）。
   */
  get value(): string {
      return this._value;
  }

  /**
   * Implemented as part of ControlValueAccessor.

   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   */
  writeValue(value): void {
    this.value = value;
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
   * Property `_destroyed` (`boolean`) storing destroyed (default: `false`).
   * @zh 属性 `_destroyed`（类型：`boolean`），用于存储或配置已销毁（默认值：`false`）。
   */
  private _destroyed: boolean = false;
  /**
   * Property `_registeredDisposables` (`Array<{ dispose: () => void }>`) storing registered disposables (default: `[]`).
   * @zh 属性 `_registeredDisposables`（类型：`Array<{ dispose: () => void }>`），用于存储或配置已注册Disposables（默认值：`[]`）。
   */
  private _registeredDisposables: Array<{ dispose: () => void }> = [];
  /**
   * Property `_registeredStyles` (`HTMLStyleElement[]`) storing registered styles (default: `[]`).
   * @zh 属性 `_registeredStyles`（类型：`HTMLStyleElement[]`），用于存储或配置已注册样式集合（默认值：`[]`）。
   */
  private _registeredStyles: HTMLStyleElement[] = [];

  /**
   * getEditorContent?: function
   * Returns the content within the editor

   * @zh 执行 `getValue`，用于获取值。
   */
  getValue(): Observable<string> {
      if (this._componentInitialized && this._editor) {
            this._value = this._editor.getValue();
            setTimeout(() => {
                this._subject.next(this._value);
                this._subject.complete();
                this._subject = new Subject();
                this.onEditorValueChange.emit(undefined);
            });
            return this._subject.asObservable();
      }else{
        return undefined;
      }
  }

  /**
   * language?: string
   * language used in editor

   * @zh 输入属性 `language` 的设置器，用于更新语言。
   */
  @Input('language')
  set language(language: string) {
    this._language = language;
    if (this._componentInitialized && this._editor) {
            let currentValue: string = this._editor.getValue();
            this._editor.dispose();
            let myDiv: HTMLDivElement = this._editorContainer.nativeElement;
            this._editor = monaco.editor.create(myDiv, Object.assign({
                value: currentValue,
                language: language,
                theme: this._theme,
            }, this.editorOptions));
            this._editor.getModel().onDidChangeContent( () => {
                this._fromEditor = true;
                this.writeValue(this._editor.getValue());
            });
            this.onEditorConfigurationChanged.emit(undefined);
            this.onEditorLanguageChanged.emit(undefined);
    }
  }
  /**
   * Gets the current language (`language: string`).
   * @zh 获取当前语言（`language: string`）。
   */
  get language(): string {
    return this._language;
  }


  /**
   * Executes `registerLanguage` to handle register language.
   * @zh 执行 `registerLanguage`，用于注册语言。
   * @param language - language parameter (`any`) / 语言参数（`any`）
   */
  registerLanguage(language): void {
    if (this._componentInitialized && this._editor && language) {
        this._editor.dispose();

        const completionItems = (language.completionItemProvider || []).map((provider: { kind? }) => {
            let resolvedKind = provider.kind;
            if (typeof resolvedKind === 'string' && typeof monaco !== 'undefined') {
                const kindKey = resolvedKind.replace(/^monaco\.languages\.CompletionItemKind\./, '');
                resolvedKind = monaco.languages?.CompletionItemKind?.[kindKey] ?? resolvedKind;
            }
            return { ...provider, kind: resolvedKind };
        });

        const monarchTokens = (language.monarchTokensProvider || []).map((tokenRule) => {
            if (!Array.isArray(tokenRule)) {
                return tokenRule;
            }
            const copy = tokenRule.slice();
            if (typeof copy[0] === 'string') {
                const match = /^\/(.*)\/([gimsuy]*)$/.exec(copy[0]);
                copy[0] = match ? new RegExp(match[1], match[2]) : new RegExp(copy[0]);
            }
            return copy;
        });

        monaco.languages.register({ id: language.id });

        monaco.languages.setMonarchTokensProvider(language.id, {
            tokenizer: {
                root: monarchTokens,
            },
        });

        // Define a new theme that constains only rules that match this language
        if (language.customTheme) {
            monaco.editor.defineTheme(language.customTheme.id, language.customTheme.theme);
            this._theme = language.customTheme.id;
        }

        const disposable = monaco.languages.registerCompletionItemProvider(language.id, {
            provideCompletionItems: () => {
                return completionItems;
            },
        });
        if (disposable) {
            this._registeredDisposables.push(disposable);
        }

        if (language.monarchTokensProviderCSS) {
            let css: HTMLStyleElement = document.createElement('style');
            css.type = 'text/css';
            css.textContent = language.monarchTokensProviderCSS;
            document.body.appendChild(css);
            this._registeredStyles.push(css);
        }
        this.onEditorConfigurationChanged.emit(undefined);
    }
  }

  /**
   * style?: string
   * css style of the editor on the page

   * @zh 输入属性 `editorStyle` 的设置器，用于更新编辑器样式。
   */
  @Input('editorStyle')
  set editorStyle(editorStyle: string) {
    this._editorStyle = editorStyle;
    if (this._componentInitialized && this._editor) {
        let containerDiv: HTMLDivElement = this._editorContainer.nativeElement;
        containerDiv.setAttribute('style', editorStyle);
        let currentValue: string = this._editor.getValue();
        this._editor.dispose();
        let myDiv: HTMLDivElement = this._editorContainer.nativeElement;
        this._editor = monaco.editor.create(myDiv, Object.assign({
            value: currentValue,
            language: this._language,
            theme: this._theme,
        }, this.editorOptions));
        this._editor.getModel().onDidChangeContent( () => {
            this._fromEditor = true;
            this.writeValue(this._editor.getValue());
        });
    }
  }
  /**
   * Gets the current editor style (`editorStyle: string`).
   * @zh 获取当前编辑器样式（`editorStyle: string`）。
   */
  get editorStyle(): string {
    return this._editorStyle;
  }


  /**
   * Input setter `theme` updating theme.
   * @zh 输入属性 `theme` 的设置器，用于更新主题。
   * @param theme - New theme value (`string`) / 新的主题值（`string`）
   */
  @Input('theme')
  set theme(theme: string) {
    this._theme = theme;
    if (this._componentInitialized && this._editor) {
        this._editor.updateOptions({'theme': theme});
        this.onEditorConfigurationChanged.emit(undefined);
    }
  }
  /**
   * Gets the current theme (`theme: string`).
   * @zh 获取当前主题（`theme: string`）。
   */
  get theme(): string {
    return this._theme;
  }

  /**
   * Input setter `automaticLayout` updating automatic layout.
   * @zh 输入属性 `automaticLayout` 的设置器，用于更新automatic布局。
   * @param automaticLayout - New automatic layout value (`any`) / 新的automatic布局值（`any`）
   */
  @Input('automaticLayout')
  set automaticLayout(automaticLayout: boolean | string) {
    this._automaticLayout = automaticLayout !== '' ? (automaticLayout === 'true' || automaticLayout === true) : true;
  }
  /**
   * Gets the current automatic layout (`automaticLayout: any`).
   * @zh 获取当前automatic布局（`automaticLayout: any`）。
   */
  get automaticLayout() {
    return this._automaticLayout;
  }

  /**
   * editorOptions?: Object
   * Options used on editor instantiation. Available options listed here:
   * https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html

   * @zh 输入属性 `editorOptions` 的设置器，用于更新编辑器配置选项。
   */
  @Input('editorOptions')
  set editorOptions(editorOptions) {
      this._editorOptions = editorOptions;
      if (this._componentInitialized && this._editor) {
          this._editor.updateOptions(editorOptions);
          this.onEditorConfigurationChanged.emit(undefined);
      }
  }
  /**
   * Gets the current editor options (`editorOptions: any`).
   * @zh 获取当前编辑器配置选项（`editorOptions: any`）。
   */
  get editorOptions() {
    return this._editorOptions;
  }

  /**
   * layout method that calls layout method of editor and instructs the editor to remeasure its container

   * @zh 执行 `layout`，用于布局。
   */
   layout(): void {
    if (this._componentInitialized && this._editor) {
        this._editor.layout();
    }
  }
  /**
   * ngOnInit only used for Electron version of editor
   * This is where the webview is created to sandbox away the editor

   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this._componentInitialized = true;
  }

  /**
   * ngAfterViewInit only used for browser version of editor
   * This is where the AMD Loader scripts are added to the browser and the editor scripts are "required"

   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    if (loadedMonaco) {
        // Wait until monaco editor is available
        this.waitForMonaco().then(() => {
            this.initMonaco();
        });
    } else {
        loadedMonaco = true;
        loadPromise = new Promise<void>((resolve) => {
            if (typeof((<{ monaco? }><unknown>window).monaco) === 'object') {
                this.initMonaco();
                resolve();
                return;
            }
            let onGotAmdLoader = () => {
                // Load monaco
                (<{ require? }><unknown>window).require.config({ paths: { 'vs': 'assets/monaco/vs' } });
                (<{ require? }><unknown>window).require(['vs/editor/editor.main'], () => {
                    this.initMonaco();
                    resolve();
                });
            };

            // Load AMD loader if necessary
            if (!(<{ require? }><unknown>window).require) {
                let loaderScript: HTMLScriptElement = document.createElement('script');
                loaderScript.type = 'text/javascript';
                loaderScript.src = 'assets/monaco/vs/loader.js';
                loaderScript.addEventListener('load', onGotAmdLoader);
                document.body.appendChild(loaderScript);
            } else {
                onGotAmdLoader();
            }
        });
    }
  }

  /**
   * waitForMonaco method Returns promise that will be fulfilled when monaco is available

   * @zh 执行 `waitForMonaco`，用于wait用于Monaco编辑器。
   */
  waitForMonaco(): Promise<void> {
    return loadPromise;
  }

  /**
   * initMonaco method creates the monaco editor into the @ViewChild('editorContainer')
   * and emit the onEditorInitialized event.  This is only used in the browser version.

   * @zh 执行 `initMonaco`，用于初始化Monaco编辑器。
   */
  private initMonaco(): void {
    if (this._destroyed || !this._editorContainer?.nativeElement) {
        return;
    }
    let containerDiv: HTMLDivElement = this._editorContainer.nativeElement;
    containerDiv.id = this._editorInnerContainer;
    this._editor = monaco.editor.create(containerDiv, Object.assign({
        value: this._value,
        language: this.language,
        theme: this._theme,
        automaticLayout: this._automaticLayout,
    }, this.editorOptions));
    setTimeout(() => {
        if (!this._destroyed) {
            this.onEditorInitialized.emit(undefined);
        }
    });
    this._editor.getModel().onDidChangeContent( () => {
        this._fromEditor = true;
        this.writeValue(this._editor.getValue());
    });

    window.addEventListener('resize', this._onWindowResize);
  }

  /**
   * Property `_onWindowResize` (`any`) storing on window resize (default: `(): void => { this._editor?.layout(); }`).
   * @zh 属性 `_onWindowResize`（类型：`any`），用于存储或配置当窗口调整尺寸（默认值：`(): void => { this._editor?.layout(); }`）。
   */
  private readonly _onWindowResize = (): void => {
    this._editor?.layout();
  };

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._destroyed = true;
    window.removeEventListener('resize', this._onWindowResize);
    this._registeredDisposables.forEach(d => d.dispose());
    this._registeredDisposables = [];
    this._registeredStyles.forEach(s => s.remove());
    this._registeredStyles = [];
    this._editor?.dispose();
    this._editor = undefined;
  }
}
