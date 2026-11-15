/**
 * @fileoverview Module `src/ux/editor/editor.component.ts` providing editor component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/editor.component.ts`，提供编辑器组件相关的定义与实现。
 */

import {
  Component, ViewChild, ElementRef, forwardRef,
  OnDestroy, ViewEncapsulation, OnInit, Output,
  EventEmitter, Input, Renderer2, SimpleChanges,
  OnChanges, Injector, ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as plugins from './plugins';
import { toHTML } from './parsers';
import { Editor } from './Editor';
import EditorError from './utils/error';

/**
 * Angular component `EditorComponent` (selector: 'dui-editor') providing editor component presentation and interaction in `src/ux/editor`.
 * @zh Angular 组件 `EditorComponent`（selector: 'dui-editor'），提供编辑器组件的视图渲染与交互逻辑（位于 `src/ux/editor`）。
 */
@Component({
  selector: 'dui-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditorComponent),
    multi: true,
  }],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  
})
export class EditorComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  /**
   * Creates an instance of `EditorComponent` and initializes its dependencies and internal state.
   * @zh 创建 `EditorComponent` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param elementRef - Injected or initial element ref (`ElementRef<HTMLElement>`) / 注入或传入的元素引用（`ElementRef<HTMLElement>`）
   */
  constructor(
    private renderer: Renderer2,
    private injector: Injector,
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  /**
   * Template/content query reference `uxEditor` (`ElementRef<any>`) targeting ux editor.
   * @zh 模板/内容视图查询引用 `uxEditor`（`@ViewChild`），指向交互体验编辑器。
   */
  @ViewChild('uxEditor', { static: true }) private uxEditor: ElementRef;

  /**
   * Input property `editor` (`Editor`) configuring editor.
   * @zh 输入属性 `editor`（类型：`Editor`），用于配置编辑器。
   */
  @Input() editor: Editor;
  /**
   * Input property `outputFormat` (`"html" | "doc"`) configuring output format.
   * @zh 输入属性 `outputFormat`（类型：`"html" | "doc"`），用于配置输出事件格式化。
   */
  @Input() outputFormat: 'doc' | 'html';
  /**
   * Input property `placeholder` (`string`) configuring placeholder (default: `'Type Here...'`).
   * @zh 输入属性 `placeholder`（类型：`string`），用于配置占位提示（默认值：`'Type Here...'`）。
   */
  @Input() placeholder = 'Type Here...';

  /**
   * Output event emitter `focusOut` (`EventEmitter<void>`) firing when focus out occurs.
   * @zh 输出事件 `focusOut`（类型：`EventEmitter<void>`），当触发聚焦输出时向外发出事件。
   */
  @Output() focusOut = new EventEmitter<void>();
  /**
   * Output event emitter `focusIn` (`EventEmitter<void>`) firing when focus in occurs.
   * @zh 输出事件 `focusIn`（类型：`EventEmitter<void>`），当触发聚焦在时向外发出事件。
   */
  @Output() focusIn = new EventEmitter<void>();

  /**
   * Property `unsubscribe` (`Subject<void>`) storing unsubscribe (default: `new Subject()`).
   * @zh 属性 `unsubscribe`（类型：`Subject<void>`），用于存储或配置取消订阅（默认值：`new Subject()`）。
   */
  private unsubscribe: Subject<void> = new Subject();
  /**
   * Property `onChange` (`(value: any) => void`) storing on change (default: `() => { }`).
   * @zh 属性 `onChange`（类型：`(value: any) => void`），用于存储或配置当变更（默认值：`() => { }`）。
   */
  private onChange: (value) => void = () => { /** */ };
  /**
   * Property `onTouched` (`() => void`) storing on touched (default: `() => { }`).
   * @zh 属性 `onTouched`（类型：`() => void`），用于存储或配置当是否已触碰（默认值：`() => { }`）。
   */
  private onTouched: () => void = () => { /** */ };

  /**
   * Writes a new value from the Angular form model into the view (`ControlValueAccessor`).
   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  writeValue(value): void {
    if (!this.outputFormat && typeof value === 'string') {
      this.outputFormat = 'html';
    }
    this.editor.setContent(value ?? '');
  }

  /**
   * Registers a callback function invoked when the control value changes in the UI (`ControlValueAccessor`).
   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`() => void`) / 函数参数（`() => void`）
   */
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function invoked when the control receives a blur/touched event (`ControlValueAccessor`).
   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`() => void`) / 函数参数（`() => void`）
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Enables or disables the UI control when the form control disabled status changes (`ControlValueAccessor`).
   * @zh 当表单控件的禁用状态变更时启用或禁用界面控件（`ControlValueAccessor` 接口实现）。
   * @param isDisabled - is disabled parameter (`boolean`) / 是否为已禁用参数（`boolean`）
   */
  setDisabledState(isDisabled: boolean): void {
    this.setMeta('UPDATE_EDITABLE', !isDisabled);
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  /**
   * Executes `handleChange` to handle handle change.
   * @zh 执行 `handleChange`，用于连接手柄变更。
   * @param jsonDoc - json doc parameter (`any`) / JSON文档参数（`any`）
   */
  private handleChange(jsonDoc): void {
    if (this.outputFormat === 'html') {
      const html = toHTML(jsonDoc, this.editor.schema);
      this.onChange(html);
      return;
    }
    this.onChange(jsonDoc);
  }

  /**
   * Executes `setMeta` to handle set meta.
   * @zh 执行 `setMeta`，用于集合元数据。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  private setMeta(key: string, value): void {
    const { dispatch, state: { tr } } = this.editor.view;
    dispatch(tr.setMeta(key, value));
  }

  /**
   * Executes `setPlaceholder` to handle set placeholder.
   * @zh 执行 `setPlaceholder`，用于集合占位提示。
   * @param placeholder - placeholder parameter (`string`) / 占位提示参数（`string`）
   */
  private setPlaceholder(placeholder: string): void {
    this.setMeta('UPDATE_PLACEHOLDER', placeholder);
  }

  /**
   * Executes `registerPlugins` to handle register plugins.
   * @zh 执行 `registerPlugins`，用于注册Plugins。
   */
  private registerPlugins(): void {
    this.editor.registerPlugin(plugins.editable());
    this.editor.registerPlugin(plugins.placeholder(this.placeholder));

    this.editor.registerPlugin(plugins.attributes({
      class: 'Editor__Content',
    }));

    this.editor.registerPlugin(plugins.focus(() => {
      this.focusIn.emit();
    }));

    this.editor.registerPlugin(plugins.blur(() => {
      this.focusOut.emit();
      this.onTouched();
    }));

    if (this.editor.features.resizeImage) {
      this.editor.registerPlugin(plugins.imageResize(this.injector));
    }

    if (this.editor.features.linkOnPaste) {
      this.editor.registerPlugin(plugins.linkify());
    }
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (!this.editor) {
      throw new EditorError('Required editor instance for initializing editor component');
    }

    this.registerPlugins();

    this.renderer.appendChild(this.uxEditor.nativeElement, this.editor.view.dom);

    this.editor.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((jsonDoc) => {
        this.handleChange(jsonDoc);
      });
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['placeholder'] && !changes['placeholder'].isFirstChange()) {
      this.setPlaceholder(changes['placeholder'].currentValue);
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
