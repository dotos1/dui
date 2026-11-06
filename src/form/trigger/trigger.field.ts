/**
 * @fileoverview Module `src/form/trigger/trigger.field.ts` providing trigger field definitions and implementation.
 * @zh 模块文件 `src/form/trigger/trigger.field.ts`，提供触发字段相关的定义与实现。
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  Optional,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  DialogService,
  IDraggableRefs,
  ResizableDraggableDialog,
} from '@dotos/dui/common/dialogs';
import { MatIconRegistry } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { Dui } from '@dotos/dui/core';
import { TranslateService } from '@dotos/dui/translator';
import { isObjectLike } from 'lodash-es';
import { isObject } from 'lodash-es';
import { AbstractTrigger } from './abstract.trigger';
import { DragRef } from '@angular/cdk/drag-drop';

/**
 * Angular component `TriggerField` (selector: 'trigger-field') providing trigger field presentation and interaction in `src/form/trigger`.
 * @zh Angular 组件 `TriggerField`（selector: 'trigger-field'），提供触发字段的视图渲染与交互逻辑（位于 `src/form/trigger`）。
 */
@Component({
  selector: 'trigger-field',
  templateUrl: 'trigger.field.html',
  styleUrls: ['trigger.scss'],
  host: {
    '[class.trigger-field-disabled]': 'disabled',
    '[class.trigger-field-opened]': 'opened',
    '[attr.aria-label]': 'label',
    '[attr.aria-required]': 'required?required.toString():false',
    '[attr.aria-disabled]': 'disabled?disabled.toString():false',
    hostID: 'trigger-field' + Math.random().toString(36).substring(2, 15),
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriggerField extends AbstractTrigger implements AfterViewInit {
  /**
   * Template/content query reference `_mapInput` (`MatInput`) targeting map input.
   * @zh 模板/内容视图查询引用 `_mapInput`（`@ViewChild`），指向映射表输入属性。
   */
  @ViewChild(MatInput, { static: true }) _mapInput: MatInput;
  /**
   * Template/content query reference `input` (`ElementRef<any>`) targeting input.
   * @zh 模板/内容视图查询引用 `input`（`@ViewChild`），指向输入属性。
   */
  @ViewChild('input') input: ElementRef;

  /**
   * Property `content` (`any`) storing content.
   * @zh 属性 `content`（类型：`any`），用于存储或配置内容。
   */
  private content;

  /**
   * Property `_onChange` (`(value: any) => void`) storing on change (default: `() => {}`).
   * @zh 属性 `_onChange`（类型：`(value: any) => void`），用于存储或配置当变更（默认值：`() => {}`）。
   */
  _onChange: (value) => void = () => {};

  /**
   * Property `_onTouched` (`() => void`) storing on touched (default: `() => {}`).
   * @zh 属性 `_onTouched`（类型：`() => void`），用于存储或配置当是否已触碰（默认值：`() => {}`）。
   */
  _onTouched = () => {};

  /**
   * Property `label` (`string`) storing label.
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
   */
  label: string;

  /**
   * Gets the current open on focus (`openOnFocus: boolean`).
   * @zh 获取当前打开当聚焦（`openOnFocus: boolean`）。
   */
  get openOnFocus(): boolean {
    return this._openOnFocus;
  }
  /**
   * Sets the open on focus (`openOnFocus`).
   * @zh 设置打开当聚焦（`openOnFocus`）。
   * @param value - New open on focus value (`boolean`) / 新的打开当聚焦值（`boolean`）
   */
  set openOnFocus(value: boolean) {
    this._openOnFocus = coerceBooleanProperty(value);
  }
  /**
   * Property `_openOnFocus` (`boolean`) storing open on focus.
   * @zh 属性 `_openOnFocus`（类型：`boolean`），用于存储或配置打开当聚焦。
   */
  private _openOnFocus: boolean;

  /**
   * Sets the is open (`isOpen`).
   * @zh 设置是否为打开（`isOpen`）。
   * @param value - New is open value (`boolean`) / 新的是否为打开值（`boolean`）
   */
  override set isOpen(value: boolean) {
    if (value && !this.opened) {
      this.open();
    }
  }

  /**
   * Property `enableKeyEvents` (`boolean`) storing enable key events (default: `true`).
   * @zh 属性 `enableKeyEvents`（类型：`boolean`），用于存储或配置启用键事件集合（默认值：`true`）。
   */
  public override enableKeyEvents = true;

  /**
   * Property `maskRe` (`any`) storing mask re.
   * @zh 属性 `maskRe`（类型：`any`），用于存储或配置遮罩Re。
   */
  protected maskRe;

  /**
   * Creates an instance of `TriggerField` and initializes its dependencies and internal state.
   * @zh 创建 `TriggerField` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _dialogService - Injected or initial dialog service (`DialogService`) / 注入或传入的对话框服务（`DialogService`）
   * @param _overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param _viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   * @param matIconRegistry - Injected or initial mat icon registry (`MatIconRegistry`) / 注入或传入的Material图标Registry（`MatIconRegistry`）
   * @param domSanitizer - Injected or initial dom sanitizer (`DomSanitizer`) / 注入或传入的DOM节点安全清理器（`DomSanitizer`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param renderer2 - Injected or initial renderer2 (`Renderer2`) / 注入或传入的renderer2（`Renderer2`）
   * @param _dir - Injected or initial dir (`Directionality`) / 注入或传入的目录（`Directionality`）
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(
    protected override _elementRef: ElementRef,
    protected override _dialogService: DialogService,
    protected override _overlay: Overlay,
    protected override _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    public detectRef: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected override translate: TranslateService,
    public renderer2: Renderer2,

    @Optional() protected override _dir: Directionality,
    @Optional() @Inject(DOCUMENT) protected override _document,
  ) {
    super(
      _elementRef,
      _dialogService,
      _overlay,
      _ngZone,
      translate,
      _dir,
      _document,
    );
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  override init(): void {
    super.init();
    if (this.field.icon && this.field.icon.indexOf('svg') != -1) {
      let icon: string = this.field.icon;
      // 只截到反斜杠为止,'/' 路径保留目录前缀(b8c5e5c 复核):
      // 'assets/svg/foo.svg' 注册名是 'assets/svg/foo',仍含 'svg',模板靠
      // field.icon.indexOf('svg') 选 svgIcon 分支。按 '/' 截成 'foo' 后
      // 这个判断失效,图标位置显示成字面文字 "foo"。
      let iconName = icon.substring(
        icon.lastIndexOf('\\') + 1,
        icon.lastIndexOf('.'),
      );
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon),
      );
      this.field.icon = iconName;
    }
    Dui.applyIf(this, this.field);
    this.field['classFormField'] = 'trigger-form-field';
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    let val = this.field.formControl.value;
    if (isObjectLike(val) && val.text) {
      this._elementRef.nativeElement.children[0].value = val.text;
    }
  }

  /**
   * Executes `coerceStringProperty` to handle coerce string property.
   * @zh 执行 `coerceStringProperty`，用于强制转换字符串属性。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private coerceStringProperty(value): string {
    const d: string = value ? value + '' : null;
    return d;
  }

  /**
   * Executes `_selectAndClose` to handle select and close.
   * @zh 执行 `_selectAndClose`，用于下拉选择And关闭。
   * @param val - val parameter (`string`) / 值参数（`string`）
   */
  override _selectAndClose(val: string): void {
    const oldValue = this._selected;
    if (isObject(val)) {
      this.field.inputValue = val['text'];
      this._selected = this.coerceStringProperty(val['value']);
    } else {
      this.field.inputValue = this.coerceStringProperty(val);
      this._selected = this.coerceStringProperty(val);
    }
    this.value = val;
    if (oldValue != this._selected) {
      this._emitChangeEvent();
      if (this.field.change && typeof this.field.change == 'function') {
        this.field.change(this, val);
      }
    }
    this._mapInput.focus();
    this._mapInput.ngDoCheck();
    this.close();
  }

  /**
   * Executes `open` to handle open.
   * @zh 执行 `open`，用于打开。
   */
  override open(): void {
    if (this.opened || this.disabled || this.field.disabled) {
      return;
    }
    super.beforeOpen();
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }
    if (this.touchUi) {
      const { matDialogRef, dragRefSubject } =
        this._dialogService.openDraggable({
          component: this.content,
          dragHandleSelectors: ['.mat-title', '.card-title-content'],
          config: {
            direction: this._dir ? this._dir.value : 'ltr',
            viewContainerRef: this._viewContainerRef,
            hasBackdrop: false,
            panelClass: 'mat-datetimepicker-dialog',
          },
        });
      this._dialogRef = matDialogRef as never;

      let resizableDraggableDialog: ResizableDraggableDialog;
      if(this.field.resizable==true) {
        dragRefSubject.subscribe((dragRf: DragRef) => {
          resizableDraggableDialog = new ResizableDraggableDialog(
            this._document,
            this.renderer2,
            matDialogRef,
            dragRf,
          );
        });
      }
      matDialogRef.afterClosed().subscribe(async () => {
        dragRefSubject.complete();
        dragRefSubject.unsubscribe();
        if(this.field.resizable==true) {  
            resizableDraggableDialog.detach();
        }
      });
    } else {
      if (!this._portal && this.content) {
        this._portal = new ComponentPortal(
          this.content,
          this._viewContainerRef,
        );
      }
    }
    super.postOpen(this.field.params);
  }
}
