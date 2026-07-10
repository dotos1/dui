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

})
export class PromptDialogComponent implements AfterViewInit, OnDestroy {
  /** @zh 对话框标题。 */
  title?: string;
  /** @zh 对话框消息内容。 */
  message?: string;
  /** @zh 内部使用，字段名称。 */
  name: string;

  /** @zh 取消按钮的文字，默认为 `'CANCEL'`。 */
  cancelButton = 'CANCEL';
  /** @zh 确认按钮的文字，默认为 `'ACCEPT'`。 */
  acceptButton = 'ACCEPT';

  /** The native `<input matInput />` element. */
  @ViewChild('input', { static: true }) _input!: ElementRef<HTMLInputElement>;

  @ViewChild('closeBtn', { static: true, read: ElementRef })
  _closeBtn!: ElementRef<HTMLButtonElement>;

  @ViewChild('acceptBtn', { static: true, read: ElementRef })
  _acceptBtn!: ElementRef<HTMLButtonElement>;

  private _destroy$ = new Subject<void>();

  /** @zh 底层 Material 输入框控件的引用。 */
  @ViewChild(MatInput) formFieldControl: MatInput;

  /** @zh 输入内容短于 `minlength` 时显示的错误文案，`{0}` 会被替换为 `minlength`。 */
  minLengthText: string = 'The minimum length for this field is {0}';

  /** @zh 输入内容超过 `maxlength` 时显示的错误文案，`{0}` 会被替换为 `maxlength`。 */
  maxLengthText: string = 'The maximum length for this field is {0}';

  /** @zh 用于校验输入内容的正则表达式（或其字符串形式）。 */
  pattern: string | RegExp = null;

  /** @zh 输入内容不匹配 `pattern` 时显示的错误文案。 */
  regexText: string = ' format is not correct';

  /** @zh 输入内容为空且 `required` 为 `true` 时显示的错误文案。 */
  blankText: string = ' This field is can not be blank!';

  /** @zh 输入内容的最小长度。 */
  minlength: number = 0;

  /** @zh 输入内容的最大长度。 */
  maxlength: number = 255;

  /** @zh 当 `dataType` 为数字类型时的最小值。 */
  min: number = -Infinity;

  /** @zh 当 `dataType` 为数字类型时的最大值。 */
  max: number = Infinity;

  /** @zh 输入内容是否为必填项。 */
  required: boolean = true;

  /** @zh 输入框的数据类型（如 `'text'`）。 */
  dataType: string = 'text';

  /** @zh 绑定输入框值的表单控件。 */
  formControl = new FormControl();

  constructor(
    private _ngZone: NgZone,
    public themeService: ThemeService,
    private _dialogRef: MatDialogRef<PromptDialogComponent>
  ) {}

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
