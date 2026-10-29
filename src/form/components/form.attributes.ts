/**
 * @fileoverview Module `src/form/components/form.attributes.ts` providing form attributes definitions and implementation.
 * @zh 模块文件 `src/form/components/form.attributes.ts`，提供表单属性列表相关的定义与实现。
 */

import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  Renderer2,
  DoCheck,
  Inject,
  OnDestroy,} from '@angular/core';
import { FieldConfig } from '@dotos/dui/core/form';
import { defineHiddenProp, FORM_VALIDATORS , observe, IObserver} from '@dotos/dui/core/form';
import { DOCUMENT } from '@angular/common';

/**
 * Angular directive `FormAttributes` (selector: '[formAttributes]') attaching form attributes behavior to host DOM elements.
 * @zh Angular 指令 `FormAttributes`（selector: '[formAttributes]'），为宿主 DOM 元素附加表单属性列表行为。
 */
@Directive({
  selector: '[formAttributes]',
  host: {
    '(focus)': 'onFocus($event)',
    '(blur)': 'onBlur($event)',
    '(change)': 'onChange($event)',
    
  }
})
export class FormAttributes implements OnChanges, DoCheck, OnDestroy {
  /**
   * Input property `formAttributes` (`FieldConfig`) configuring field.
   * @zh 输入属性 `formAttributes`（类型：`FieldConfig`），用于配置字段。
   */
  @Input('formAttributes') field: FieldConfig;
  /**
   * Input property `id` (`string`) configuring id.
   * @zh 输入属性 `id`（类型：`string`），用于配置唯一标识。
   */
  @Input() id: string;

  /**
   * Property `document` (`Document`) storing document.
   * @zh 属性 `document`（类型：`Document`），用于存储或配置文档对象。
   */
  private document: Document;
  /**
   * Property `uiAttributesCache` (`any`) storing ui attributes cache (default: `{}`).
   * @zh 属性 `uiAttributesCache`（类型：`any`），用于存储或配置界面属性列表缓存（默认值：`{}`）。
   */
  private uiAttributesCache: Record<string, unknown> = {};
  /**
   * Property `uiAttributes` (`any[]`) storing ui attributes.
   * @zh 属性 `uiAttributes`（类型：`any[]`），用于存储或配置界面属性列表。
   */
  private uiAttributes = [
    ...FORM_VALIDATORS,
    'tabindex',
    'placeholder',
    'readonly',
    'disabled',
    'step',
  ];
  /**
   * Property `focusObserver` (`IObserver<boolean>`) storing focus observer.
   * @zh 属性 `focusObserver`（类型：`IObserver<boolean>`），用于存储或配置聚焦观察者。
   */
  private focusObserver: IObserver<boolean>;
  /**
   * Property `attributesObserver` (`IObserver<any>`) storing attributes observer.
   * @zh 属性 `attributesObserver`（类型：`IObserver<any>`），用于存储或配置属性列表观察者。
   */
  private attributesObserver;

  /**
   * Property `uiEvents` (`any`) storing ui events.
   * @zh 属性 `uiEvents`（类型：`any`），用于存储或配置界面事件集合。
   */
  private uiEvents = {
    listeners: [],
    events: [
      'click',
      'keyup',
      'keydown',
      'keypress',
    ],
  };

  /**
   * Gets the current field attr elements (`fieldAttrElements: ElementRef[]`).
   * @zh 获取当前字段特性元素列表（`fieldAttrElements: ElementRef[]`）。
   */
  private get fieldAttrElements(): ElementRef[] {
    return (this.field && (this.field['_elementRefs'] as ElementRef[])) || [];
 }

  /**
   * Creates an instance of `FormAttributes` and initializes its dependencies and internal state.
   * @zh 创建 `FormAttributes` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param elementRef - Injected or initial element ref (`ElementRef`) / 注入或传入的元素引用（`ElementRef`）
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) _document,
  ) {
    this.document = _document;
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['field']) {
      if(typeof this.field.name =='string'){
        this.field.name && this.setAttribute('name', this.field.name);
        this.uiEvents.listeners.forEach(listener => listener());
        this.uiEvents.listeners = [];
        this.uiEvents.events.forEach(eventName => {
          if (this.field[eventName]) {
            this.uiEvents.listeners.push(
              this.renderer.listen(
                this.elementRef.nativeElement,
                eventName,
                (e) => (this.field[eventName] as Function)(this.field, e),
              ),
            );
          }
        });
      }
      this.attributesObserver && this.attributesObserver.unsubscribe();
      if (this.field && this.field.attributes) {
        this.attributesObserver = observe(this.field, [ 'attributes'], ({ currentValue, previousValue }) => {
          if (previousValue) {
            Object.keys(previousValue).forEach((attr) => this.removeAttribute(attr));
          }
          if (currentValue) {
            Object.keys(currentValue).forEach((attr) => this.setAttribute(attr, currentValue[attr]));
          }
        });
      }

      this.detachElementRef(changes['field'].previousValue);
      this.attachElementRef(changes['field'].currentValue);
      if (this.fieldAttrElements.length === 1) {
        !this.id && this.field.id && this.setAttribute('id', this.field.id);
        this.focusObserver && this.focusObserver.unsubscribe();
        this.focusObserver = observe<boolean>(this.field, ['focused'], ({ currentValue }) => {
          this.toggleFocus(currentValue);
        });
      }
    }
    if (changes['id']) {
      this.setAttribute('id', this.id);
    }
  }


  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck() {
    this.uiAttributes.forEach(attr => {
      const value = this[attr];
      if (this.uiAttributesCache[attr] !== value) {
        this.uiAttributesCache[attr] = value;
        if (value || value === 0) {
          this.setAttribute(attr, value === true ? attr : `${value}`);
        } else {
          this.removeAttribute(attr);
        }
      }
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.uiEvents.listeners.forEach(listener => listener());
    this.uiEvents.listeners = [];
    this.detachElementRef(this.field);
    this.attributesObserver && this.attributesObserver.unsubscribe();
    this.focusObserver && this.focusObserver.unsubscribe();
  }

  /**
   * Executes `toggleFocus` to handle toggle focus.
   * @zh 执行 `toggleFocus`，用于开关聚焦。
   * @param value - value parameter (`boolean`) / 值参数（`boolean`）
   */
  toggleFocus(value: boolean) {
    const element = this.fieldAttrElements ? this.fieldAttrElements[0] : null;
    if (!element || !element.nativeElement.focus) {
      return;
    }
    const isFocused = !!this.document.activeElement
      && this.fieldAttrElements
        .some(({ nativeElement }) => this.document.activeElement === nativeElement || nativeElement.contains(this.document.activeElement));

    if (value && !isFocused) {
      element.nativeElement.focus();
    } else if (!value && isFocused) {
      element.nativeElement.blur();
    }
  }

  /**
   * Executes `onFocus` to handle on focus.
   * @zh 执行 `onFocus`，用于当聚焦。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onFocus($event) {
    this.focusObserver && this.focusObserver.setValue(true);
    if (this.field.focus) {
      this.field.focus(this.field, $event);
    }
  }

  /**
   * Executes `onBlur` to handle on blur.
   * @zh 执行 `onBlur`，用于当失焦。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onBlur($event) {
    this.focusObserver && this.focusObserver.setValue(false);
    if (this.field.blur) {
      this.field.blur(this.field, $event);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onChange` to handle on change.
   * @zh 执行 `onChange`，用于当变更。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onChange($event) {
    if (this.field.change) {
      this.field.change(this.field,this.field.formControl.value);
    }
    if (this.field.formControl) {
      this.field.formControl.markAsDirty();
    }
  }

  /**
   * Executes `attachElementRef` to handle attach element ref.
   * @zh 执行 `attachElementRef`，用于挂载元素引用。
   * @param f - f parameter (`FieldConfig`) / f参数（`FieldConfig`）
   */
  private attachElementRef(f: FieldConfig) {
    if (!f) {
      return;
    }
    const refs = f['_elementRefs'] as ElementRef[];
    if (refs && refs.indexOf(this.elementRef) === -1) {
      refs.push(this.elementRef);
    } else {
      defineHiddenProp(f, '_elementRefs', [this.elementRef]);
    }
  }

  /**
   * Executes `detachElementRef` to handle detach element ref.
   * @zh 执行 `detachElementRef`，用于卸载元素引用。
   * @param f - f parameter (`FieldConfig`) / f参数（`FieldConfig`）
   */
  private detachElementRef(f: FieldConfig) {
    const refs = f && (f['_elementRefs'] as ElementRef[]);
    const index = refs ? refs.indexOf(this.elementRef) : -1;
    if (index !== -1) {
      refs.splice(index, 1);
    }
  }

  /**
   * Executes `setAttribute` to handle set attribute.
   * @zh 执行 `setAttribute`，用于集合HTML属性。
   * @param attr - attr parameter (`string`) / 特性参数（`string`）
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  private setAttribute(attr: string, value: string) {
    this.renderer.setAttribute(this.elementRef.nativeElement, attr, value);
  }

  /**
   * Executes `removeAttribute` to handle remove attribute.
   * @zh 执行 `removeAttribute`，用于移除HTML属性。
   * @param attr - attr parameter (`string`) / 特性参数（`string`）
   */
  private removeAttribute(attr: string) {
    this.renderer.removeAttribute(this.elementRef.nativeElement, attr);
  }
}
