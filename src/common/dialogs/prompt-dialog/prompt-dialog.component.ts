/**
 * @fileoverview Module `src/common/dialogs/prompt-dialog/prompt-dialog.component.ts` providing prompt dialog component definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/prompt-dialog/prompt-dialog.component.ts`，提供prompt对话框组件相关的定义与实现。
 */

import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { fromEvent, Subject } from 'rxjs';
import {  takeUntil } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { ThemeService } from '@dotos/dui/theme';

/**
 * Single-input dialog with built-in validation (length/min/max/pattern/required); normally
 * opened via {@link DialogService.openPrompt}, and resolves with the entered value.
 * @zh 带内置校验（长度/最小值/最大值/正则/必填）的单输入框对话框；通常通过
 * {@link DialogService.openPrompt} 打开，关闭时返回输入的值。
 */
@Component({
  selector: 'dui-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss'],
  standalone: false,

})
export class PromptDialogComponent implements AfterViewInit, OnDestroy {
  /**
   * Property `title` (`string`) storing title.
   * @zh 对话框标题。
   * @zh 对话框标题。
   */
  title?: string;
  /**
   * Property `message` (`string`) storing message.
   * @zh 对话框消息内容。
   * @zh 对话框消息内容。
   */
  message?: string;
  /**
   * Property `name` (`string`) storing name.
   * @zh 内部使用，字段名称。
   * @zh 内部使用，字段名称。
   */
  name: string;

  /**
   * Property `cancelButton` (`string`) storing cancel button (default: `'CANCEL'`).
   * @zh 取消按钮的文字，默认为 `'CANCEL'`。
   * @zh 取消按钮的文字，默认为 `'CANCEL'`。
   */
  cancelButton = 'CANCEL';
  /**
   * Property `acceptButton` (`string`) storing accept button (default: `'ACCEPT'`).
   * @zh 确认按钮的文字，默认为 `'ACCEPT'`。
   * @zh 确认按钮的文字，默认为 `'ACCEPT'`。
   */
  acceptButton = 'ACCEPT';

  /**
   * The native `<input matInput />` element.
   * @zh 模板/内容视图查询引用 `_input`（`@ViewChild`），指向输入属性。
   */
  @ViewChild('input', { static: true }) _input!: ElementRef<HTMLInputElement>;

  /**
   * Template/content query reference `_closeBtn` (`ElementRef<HTMLButtonElement>`) targeting close btn.
   * @zh 模板/内容视图查询引用 `_closeBtn`（`@ViewChild`），指向关闭按钮。
   */
  @ViewChild('closeBtn', { static: true, read: ElementRef })
  _closeBtn!: ElementRef<HTMLButtonElement>;

  /**
   * Template/content query reference `_acceptBtn` (`ElementRef<HTMLButtonElement>`) targeting accept btn.
   * @zh 模板/内容视图查询引用 `_acceptBtn`（`@ViewChild`），指向accept按钮。
   */
  @ViewChild('acceptBtn', { static: true, read: ElementRef })
  _acceptBtn!: ElementRef<HTMLButtonElement>;

  /**
   * Property `_destroy$` (`Subject<void>`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `_destroy$`（类型：`Subject<void>`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private _destroy$ = new Subject<void>();

  /**
   * @zh 底层 Material 输入框控件的引用。
   * @zh 底层 Material 输入框控件的引用。
   */
  @ViewChild(MatInput) formFieldControl: MatInput;

  /**
   * Property `minLengthText` (`string`) storing min length text.
   * @zh 输入内容短于 `minlength` 时显示的错误文案，`{0}` 会被替换为 `minlength`。
   * @zh 输入内容短于 `minlength` 时显示的错误文案，`{0}` 会被替换为 `minlength`。
   */
  minLengthText: string = 'The minimum length for this field is {0}';

  /**
   * Property `maxLengthText` (`string`) storing max length text.
   * @zh 输入内容超过 `maxlength` 时显示的错误文案，`{0}` 会被替换为 `maxlength`。
   * @zh 输入内容超过 `maxlength` 时显示的错误文案，`{0}` 会被替换为 `maxlength`。
   */
  maxLengthText: string = 'The maximum length for this field is {0}';

  /**
   * Property `pattern` (`string | RegExp`) storing pattern (default: `null`).
   * @zh 用于校验输入内容的正则表达式（或其字符串形式）。
   * @zh 用于校验输入内容的正则表达式（或其字符串形式）。
   */
  pattern: string | RegExp = null;

  /**
   * Property `regexText` (`string`) storing regex text (default: `' format is not correct'`).
   * @zh 输入内容不匹配 `pattern` 时显示的错误文案。
   * @zh 输入内容不匹配 `pattern` 时显示的错误文案。
   */
  regexText: string = ' format is not correct';

  /**
   * Property `blankText` (`string`) storing blank text (default: `' This field is can not be blank!'`).
   * @zh 输入内容为空且 `required` 为 `true` 时显示的错误文案。
   * @zh 输入内容为空且 `required` 为 `true` 时显示的错误文案。
   */
  blankText: string = ' This field is can not be blank!';

  /**
   * Property `minlength` (`number`) storing minlength (default: `0`).
   * @zh 输入内容的最小长度。
   * @zh 输入内容的最小长度。
   */
  minlength: number = 0;

  /**
   * Property `maxlength` (`number`) storing maxlength (default: `255`).
   * @zh 输入内容的最大长度。
   * @zh 输入内容的最大长度。
   */
  maxlength: number = 255;

  /**
   * Property `min` (`number`) storing min (default: `-Infinity`).
   * @zh 当 `dataType` 为数字类型时的最小值。
   * @zh 当 `dataType` 为数字类型时的最小值。
   */
  min: number = -Infinity;

  /**
   * Property `max` (`number`) storing max (default: `Infinity`).
   * @zh 当 `dataType` 为数字类型时的最大值。
   * @zh 当 `dataType` 为数字类型时的最大值。
   */
  max: number = Infinity;

  /**
   * Property `required` (`boolean`) storing required (default: `true`).
   * @zh 输入内容是否为必填项。
   * @zh 输入内容是否为必填项。
   */
  required: boolean = true;

  /**
   * Property `dataType` (`string`) storing data type (default: `'text'`).
   * @zh 输入框的数据类型（如 `'text'`）。
   * @zh 输入框的数据类型（如 `'text'`）。
   */
  dataType: string = 'text';

  /**
   * Property `formControl` (`FormControl<any>`) storing form control (default: `new FormControl()`).
   * @zh 绑定输入框值的表单控件。
   * @zh 绑定输入框值的表单控件。
   */
  formControl = new FormControl();

  /**
   * Creates an instance of `PromptDialogComponent` and initializes its dependencies and internal state.
   * @zh 创建 `PromptDialogComponent` 实例，并初始化其依赖项与内部状态。
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param _dialogRef - Injected or initial dialog ref (`MatDialogRef<PromptDialogComponent, any>`) / 注入或传入的对话框引用（`MatDialogRef<PromptDialogComponent, any>`）
   */
  constructor(
    private _ngZone: NgZone,
    public themeService: ThemeService,
    private _dialogRef: MatDialogRef<PromptDialogComponent>
  ) {}

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => this._input.nativeElement.focus());
      fromEvent(this._input.nativeElement, 'focus')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._input.nativeElement.select();
        });

      fromEvent<KeyboardEvent>(this._closeBtn.nativeElement, 'keydown')
        .pipe(takeUntil(this._destroy$))
        .subscribe((event) => {
          if (event.keyCode === RIGHT_ARROW) {
            this._acceptBtn.nativeElement.focus();
          }
        });

      fromEvent<KeyboardEvent>(this._acceptBtn.nativeElement, 'keydown')
        .pipe(takeUntil(this._destroy$))
        .subscribe((event) => {
          if (event.keyCode === LEFT_ARROW) {
            this._closeBtn.nativeElement.focus();
          }
        });
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._destroy$.next();
  }

  /**
   * Closes the dialog without a value.
   * @zh 关闭对话框，不返回任何值。
   */
  cancel(): void {
    this._dialogRef.close();
  }

  /**
   * Closes the dialog, resolving with the entered value.
   * @zh 关闭对话框，返回输入的值。
   */
  accept(): void {
    this._dialogRef.close(this.formControl.value);
  }
}
