/**
 * @fileoverview Module `src/form/components/field.component.ts` providing field component definitions and implementation.
 * @zh 模块文件 `src/form/components/field.component.ts`，提供字段组件相关的定义与实现。
 */

import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  SimpleChanges,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterContentInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { isPhoneTerminal } from '@dotos1/dui/base';
import { FormConfig } from '@dotos1/dui/core/form';
import { FieldConfig,FieldConfigCache } from '@dotos1/dui/core/form';
import { defineHiddenProp, observe, observeDeep, getFieldValue, assignFieldValue } from '@dotos1/dui/core/form';
import { FieldWrapper } from '@dotos1/dui/core/form';
import { FieldType } from '@dotos1/dui/core/form';
import { isObservable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

/**
 * Angular component `FieldComponent` (selector: 'dui-field') providing field component presentation and interaction in `src/form/components`.
 * @zh Angular 组件 `FieldComponent`（selector: 'dui-field'），提供字段组件的视图渲染与交互逻辑（位于 `src/form/components`）。
 */
@Component({
  selector: 'dui-field',
  template: `
     <ng-template #container></ng-template>
  `,
  host: {
    '[style.display]': 'field.hidden ? "none":field.xtype=="hidden-field"?"none":""',
    '[style.flex]': 'field.xtype=="hidden-field"?"0":"1"',
    '[class]': 'field.className? field.className : className',
    '[attr.data-field]': 'phone ? field.name : null',
    hostID: 'dui-field' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FieldComponent implements OnInit, OnChanges,  AfterContentInit, AfterViewInit, OnDestroy {

  /**
   * Whether the terminal is a phone. Only then the field name is exposed on the host (layout assertions, locating a field).
   * @zh 是否手机类。手机类下才把字段名放到宿主属性上（布局断言、定位字段用），桌面 DOM 不变。
   */
  readonly phone = isPhoneTerminal();

  /**
   * Input property `field` (`FieldConfig`) configuring field.
   * @zh 输入属性 `field`（类型：`FieldConfig`），用于配置字段。
   */
  @Input() field: FieldConfig;

  /**
   * Input property `className` (`string`) configuring fallback host CSS class name (default: `""`).
   * @zh 输入属性 `className`（类型：`string`），用于配置宿主默认 CSS 类名（默认值：`""`）。
   */
  @Input() className: string = '';

  /**
   * Template/content query reference `containerRef` (`ViewContainerRef`) targeting container ref.
   * @zh 模板/内容视图查询引用 `containerRef`（`@ViewChild`），指向容器引用。
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) containerRef: ViewContainerRef;

  /**
   * Property `hostObservers` (`IObserver<unknown>[]`) storing host observers (default: `[]`).
   * @zh 属性 `hostObservers`（类型：`IObserver<unknown>[]`），用于存储或配置宿主观察者（默认值：`[]`）。
   */
  private hostObservers: ReturnType<typeof observe>[] = [];

  /**
   * Property `componentRefs` (`any[]`) storing component refs (default: `[]`).
   * @zh 属性 `componentRefs`（类型：`any[]`），用于存储或配置组件引用（默认值：`[]`）。
   */
  private componentRefs = [];

  /**
   * Property `hooksObservers` (`Function[]`) storing hooks observers (default: `[]`).
   * @zh 属性 `hooksObservers`（类型：`Function[]`），用于存储或配置hooks观察者（默认值：`[]`）。
   */
  private hooksObservers: Function[] = [];

  /**
   * Property `valueChangesUnsubscribe` (`() => void`) storing value changes unsubscribe (default: `() => {}`).
   * @zh 属性 `valueChangesUnsubscribe`（类型：`() => void`），用于存储或配置值变更集合取消订阅（默认值：`() => {}`）。
   */
  valueChangesUnsubscribe = () => {};

  /**
   * Creates an instance of `FieldComponent` and initializes its dependencies and internal state.
   * @zh 创建 `FieldComponent` 实例，并初始化其依赖项与内部状态。
   * @param formConfig - Injected or initial form config (`FormConfig`) / 注入或传入的表单配置（`FormConfig`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   */
  constructor(
    private formConfig: FormConfig,
    private renderer: Renderer2,
    public changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  init() {
    this.resetRefs(this.field);
    this.render();
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this.triggerHook('afterContentInit');
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    this.triggerHook('afterViewInit');
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.triggerHook('onInit');
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  ngOnChanges(changes: SimpleChanges) {
    this.triggerHook('onChanges', changes);
  }
  /**
   * Executes `refresh` to handle refresh.
   * @zh 执行 `refresh`，用于刷新。
   */
  refresh(){
    this.changeDetector.detectChanges();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.resetRefs(this.field);
    this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
    this.hooksObservers.forEach((unsubscribe) => unsubscribe());
    this.valueChangesUnsubscribe();
    this.triggerHook('onDestroy');
  }

  /**
   * Executes `renderField` to handle render field.
   * @zh 执行 `renderField`，用于渲染字段。
   * @param containerRef - container ref parameter (`ViewContainerRef`) / 容器引用参数（`ViewContainerRef`）
   * @param f - f parameter (`FieldConfigCache`) / f参数（`FieldConfigCache`）
   * @param wrappers - wrappers parameter (`string[]`) / 包装器列表参数（`string[]`）
   */
  private renderField(containerRef: ViewContainerRef, f: FieldConfigCache, wrappers: string[] = []) {
    if (this.containerRef === containerRef) {
      this.resetRefs(this.field);
      this.containerRef.clear();
      wrappers = this.field ? this.field.wrappers : [];
    }
    if (wrappers && wrappers.length > 0) {
      const [wrapper, ...wps] = wrappers;
      const { component } = this.formConfig.getWrapper(wrapper);
      const ref = containerRef.createComponent<FieldWrapper>(component);
      this.attachComponentRef(ref, f);
      observe<ViewContainerRef>(ref.instance as never, ['fieldComponent'], ({ currentValue, previousValue, firstChange }) => {
        if (currentValue) {
          const viewRef = previousValue ? previousValue.detach() : null;
          if (viewRef && !viewRef.destroyed) {
            currentValue.insert(viewRef);
          } else {
            this.renderField(currentValue, f, wps);
          }
          !firstChange && ref.changeDetectorRef.detectChanges();
        }
      });
    } else if (f && f.xtype) {
      const { component } = this.formConfig.getType(f.xtype);
      const ref = containerRef.createComponent<FieldWrapper>(component);

      this.attachComponentRef(ref, f);
    }
  }

  /**
   * Executes `triggerHook` to handle trigger hook.
   * @zh 执行 `triggerHook`，用于触发Hook。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  private triggerHook(name: string, changes?: SimpleChanges) {
    if (name === 'onInit' || (name === 'onChanges' && changes['field'] && !changes['field'].firstChange)) {
      this.valueChangesUnsubscribe = this.fieldChanges(this.field);
    }
    if (this.field && this.field.hooks && this.field.hooks[name]) {
      if (!changes || changes['field']) {
        const r = this.field.hooks[name](this.field);
        if (isObservable(r) && ['onInit', 'afterContentInit', 'afterViewInit'].indexOf(name) !== -1) {
          const sub = r.subscribe();
          this.hooksObservers.push(() => sub.unsubscribe());
        }
      }
    }
    if (name === 'onChanges' && changes['field']) {
      this.resetRefs(changes['field'].previousValue);
      this.render();
    }
  }

  /**
   * Executes `attachComponentRef` to handle attach component ref.
   * @zh 执行 `attachComponentRef`，用于挂载组件引用。
   * @param ref - ref parameter (`ComponentRef<T>`) / 引用参数（`ComponentRef<T>`）
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private attachComponentRef<T extends FieldType>(ref: ComponentRef<T>, field: FieldConfigCache) {
    this.componentRefs.push(ref);
    field._componentRefs.push(ref);
    Object.assign(ref.instance, { field });
    // xtype 指到一个不是字段类型的组件（例如独立控件 toggle-select）时说清楚，不再报 `ref.instance.init is not a function`
    if (typeof ref.instance.init !== 'function') {
      throw new Error(`[dui-form] xtype "${field.xtype}" is not a form field type (no init). For a segmented toggle use "toggle-select-field".`);
    }
    ref.instance.init(field);
    this.componentRefs.push(ref);
  }

  /**
   * Executes `render` to handle render.
   * @zh 执行 `render`，用于渲染。
   */
  private render() {
    if (!this.field) {
      return;
    }
    this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
    this.hostObservers = [
      observe(this.field, ['hide'], ({ firstChange, currentValue }) => {
        if (!this.formConfig.extras.lazyRender) {
          firstChange && this.renderField(this.containerRef, this.field);
          if (!firstChange || (firstChange && currentValue)) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', currentValue ? 'none' : '');
          }
        } else {
          if (currentValue) {
            this.containerRef.clear();
          } else {
            this.renderField(this.containerRef, this.field);
          }
        }

        this.field.option.detectChanges(this.field);
      }),
      observe(this.field, ['className'], ({ firstChange, currentValue }) => {
        if (!firstChange || (firstChange && currentValue)) {
          this.renderer.setAttribute(this.elementRef.nativeElement, 'class', currentValue as string);
        }
      }),
    ];
  }
  /**
   * Executes `resetRefs` to handle reset refs.
   * @zh 执行 `resetRefs`，用于重置引用。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private resetRefs(field: FieldConfigCache) {
    if (field) {
      if (field._componentRefs) {
        field._componentRefs = field._componentRefs.filter((ref) => this.componentRefs.indexOf(ref) === -1);
      } else {
        defineHiddenProp(this.field, '_componentRefs', []);
      }
    }
    this.componentRefs = [];
  }

  /**
   * Executes `fieldChanges` to handle field changes.
   * @zh 执行 `fieldChanges`，用于字段变更集合。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private fieldChanges(field: FieldConfigCache) {
    this.valueChangesUnsubscribe();
    if (!field) {
      return () => {};
    }
    const subscribes = [
      observeDeep({
        source: field,
        target: field,
        paths: [],
        setFn: () => field.option.detectChanges(field),
      }),
      observeDeep({
        source: field,
        target: field.option.formState,
        paths: ['options', 'formState'],
        setFn: () => field.option.detectChanges(field),
      }),
    ];
    for (const path of [['template'], ['fieldGroupClassName'], ['validation', 'show']]) {
      const fieldObserver = observe(
        field,
        path,
        ({ firstChange }) => !firstChange && field.option.detectChanges(field),
      );
      subscribes.push(() => fieldObserver.unsubscribe());
    }
    if (field.name && !field.fieldGroup) {
      const control = field.formControl;
      let valueChanges = control.valueChanges.pipe(distinctUntilChanged());
      if (control.value !== getFieldValue(field)) {
        valueChanges = valueChanges.pipe(startWith(control.value));
      }
      const { updateOn, debounce } = field.modelOptions;
      if ((!updateOn || updateOn === 'change') && debounce && debounce.default > 0) {
        valueChanges = control.valueChanges.pipe(debounceTime(debounce.default));
      }

      const sub = valueChanges.subscribe((value) => {

        if (control instanceof FormControl && control['_fields'] && control['_fields'].length > 1) {
          control.patchValue(value, { emitEvent: false, onlySelf: true });
        }
        if (field.parsers && field.parsers.length > 0) {
          field.parsers.forEach((parserFn) => (value = parserFn(value)));
        }
        assignFieldValue(field, value);
        field.option.fieldChanges.next({ value, field, type: 'valueChanges' });
      });
      subscribes.push(() => sub.unsubscribe());
    }
    return () => subscribes.forEach((subscribe) => subscribe());
  }
}
