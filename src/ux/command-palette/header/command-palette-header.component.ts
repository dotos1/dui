/**
 * @fileoverview Module `src/ux/command-palette/header/command-palette-header.component.ts` providing command palette header component definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/header/command-palette-header.component.ts`，提供命令调色板表头组件相关的定义与实现。
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output, 
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { debounceTime, Subject , timer } from 'rxjs';
import { takeUntil, take, tap} from 'rxjs/operators';
import { FormControl } from '@angular/forms';

/**
 * Angular component `CommandPaletteHeaderComponent` (selector: 'command-palette-header') providing command palette header component presentation and interaction in `src/ux/command-palette/header`.
 * @zh Angular 组件 `CommandPaletteHeaderComponent`（selector: 'command-palette-header'），提供命令调色板表头组件的视图渲染与交互逻辑（位于 `src/ux/command-palette/header`）。
 */
@Component({
  selector: 'command-palette-header',
  templateUrl: './command-palette-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class CommandPaletteHeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Template/content query reference `input` (`ElementRef<HTMLInputElement>`) targeting input.
   * @zh 模板/内容视图查询引用 `input`（`@ViewChild`），指向输入属性。
   */
  @ViewChild('input')
  private readonly input!: ElementRef<HTMLInputElement>;

  /**
   * Output event emitter `searchedValue$` (`EventEmitter<string>`) firing when searched value occurs.
   * @zh 输出事件 `searchedValue$`（类型：`EventEmitter<string>`），当触发已搜索值时向外发出事件。
   */
  @Output()
  readonly searchedValue$: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Output event emitter `keyUpPressed$` (`EventEmitter<void>`) firing when key up pressed occurs.
   * @zh 输出事件 `keyUpPressed$`（类型：`EventEmitter<void>`），当触发键向上按下时向外发出事件。
   */
  @Output()
  readonly keyUpPressed$: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event emitter `keyDownPressed$` (`EventEmitter<void>`) firing when key down pressed occurs.
   * @zh 输出事件 `keyDownPressed$`（类型：`EventEmitter<void>`），当触发键向下按下时向外发出事件。
   */
  @Output()
  readonly keyDownPressed$: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event emitter `keyEnterPressed$` (`EventEmitter<void>`) firing when key enter pressed occurs.
   * @zh 输出事件 `keyEnterPressed$`（类型：`EventEmitter<void>`），当触发键进入按下时向外发出事件。
   */
  @Output()
  readonly keyEnterPressed$: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Property `inputControl` (`FormControl<any>`) storing input control (default: `new FormControl('')`).
   * @zh 属性 `inputControl`（类型：`FormControl<any>`），用于存储或配置输入属性表单控件（默认值：`new FormControl('')`）。
   */
  readonly inputControl: FormControl = new FormControl('');
  /**
   * Property `onDestroy$` (`Subject<void>`) storing on destroy (default: `new Subject<void>()`).
   * @zh 属性 `onDestroy$`（类型：`Subject<void>`），用于存储或配置当销毁（默认值：`new Subject<void>()`）。
   */
  private readonly onDestroy$: Subject<void> = new Subject<void>();

  /**
   * Property `clearBtnVisible` (`boolean`) storing clear btn visible (default: `false`).
   * @zh 属性 `clearBtnVisible`（类型：`boolean`），用于存储或配置清空按钮可见（默认值：`false`）。
   */
  clearBtnVisible: boolean = false;

  /**
   * Creates an instance of `CommandPaletteHeaderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CommandPaletteHeaderComponent` 实例，并初始化其依赖项与内部状态。
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.observeSearchedValue();
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    timer(500)
      .pipe(
        take(1),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => this.focusInput());
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Executes `onKeyUp` to handle on key up.
   * @zh 执行 `onKeyUp`，用于当键向上。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  onKeyUp(event: Event): void {
    this.stopDefaultBehavior(event);
    this.keyUpPressed$.emit();
  }

  /**
   * Executes `onKeyDown` to handle on key down.
   * @zh 执行 `onKeyDown`，用于当键向下。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  onKeyDown(event: Event): void {
    this.stopDefaultBehavior(event);
    this.keyDownPressed$.emit();
  }

  /**
   * Executes `onKeyEnter` to handle on key enter.
   * @zh 执行 `onKeyEnter`，用于当键进入。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  onKeyEnter(event: Event): void {
    this.stopDefaultBehavior(event);
    this.keyEnterPressed$.emit();
  }

  /**
   * Executes `clearInput` to handle clear input.
   * @zh 执行 `clearInput`，用于清空输入属性。
   */
  clearInput(): void {
    this.inputControl.reset();
    this.focusInput();
  }

  /**
   * Executes `observeSearchedValue` to handle observe searched value.
   * @zh 执行 `observeSearchedValue`，用于观察已搜索值。
   */
  private observeSearchedValue(): void {
    this.inputControl
        .valueChanges
        .pipe(
          tap((value) => {
            this.clearBtnVisible = !! value;
            this.changeDetectorRef.detectChanges();
          }),
          debounceTime(400),
          takeUntil(this.onDestroy$)
        )
        .subscribe(value => this.searchedValue$.emit(value));

  }

  /**
   * Executes `focusInput` to handle focus input.
   * @zh 执行 `focusInput`，用于聚焦输入属性。
   */
  private focusInput(): void {
    this.input.nativeElement.focus()
  }

  /**
   * Executes `stopDefaultBehavior` to handle stop default behavior.
   * @zh 执行 `stopDefaultBehavior`，用于停止默认Behavior。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  private stopDefaultBehavior(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
