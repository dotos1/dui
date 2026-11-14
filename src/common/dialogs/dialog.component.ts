/**
 * @fileoverview Module `src/common/dialogs/dialog.component.ts` providing dialog component definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/dialog.component.ts`，提供对话框组件相关的定义与实现。
 */

import {
  Component,
  Directive,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DotosConfig, DotosConfigService, duiDialogTheme, ThemeService } from '@dotos/dui/theme';
import { Subject } from 'rxjs';

import {  takeUntil } from 'rxjs/operators';
/**
 * Angular directive `duiDialogTitleDirective` (selector: '[duiDialogTitle]') attaching dui dialog title directive behavior to host DOM elements.
 * @zh 标记 `dui-dialog` 内容投影中的标题区域。
 * @zh 标记 `dui-dialog` 内容投影中的标题区域。
 */
@Directive({ selector: '[duiDialogTitle]', standalone: false })

export class duiDialogTitleDirective {}

/**
 * Angular directive `duiDialogContentDirective` (selector: '[duiDialogContent]') attaching dui dialog content directive behavior to host DOM elements.
 * @zh 标记 `dui-dialog` 内容投影中的主体内容区域。
 * @zh 标记 `dui-dialog` 内容投影中的主体内容区域。
 */
@Directive({ selector: '[duiDialogContent]', standalone: false })
export class duiDialogContentDirective {}

/**
 * Angular directive `duiDialogActionsDirective` (selector: '[duiDialogActions]') attaching dui dialog actions directive behavior to host DOM elements.
 * @zh 标记 `dui-dialog` 内容投影中的操作按钮区域。
 * @zh 标记 `dui-dialog` 内容投影中的操作按钮区域。
 */
@Directive({ selector: '[duiDialogActions]', standalone: false })
export class duiDialogActionsDirective {}

/**
 * Angular directive `duiDialogStatusDirective` (selector: '[duiDialogStatus]') attaching dui dialog status directive behavior to host DOM elements.
 * @zh 标记 `dui-dialog` 内容投影中的状态提示区域。
 * @zh 标记 `dui-dialog` 内容投影中的状态提示区域。
 */
@Directive({ selector: '[duiDialogStatus]', standalone: false })
export class duiDialogStatusDirective {}

/**
 * Generic dialog shell that projects title/content/actions/status sections
 * (via `duiDialogTitle`/`duiDialogContent`/`duiDialogActions`/`duiDialogStatus`)
 * and applies the app's current theme to the dialog's own theme scope.
 * @zh 通用对话框外壳，通过 `duiDialogTitle`/`duiDialogContent`/`duiDialogActions`/`duiDialogStatus`
 * 投影标题/内容/操作/状态区域，并将应用当前主题应用到对话框自身的主题作用域。
 */
@Component({
  selector: 'dui-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: false,

})
export class duiDialogComponent implements AfterContentInit ,OnInit,OnDestroy{
  /**
   * Template/content query reference `dialogTitle` (`QueryList<duiDialogTitleDirective>`) targeting dialog title.
   * @zh 投影进来的标题区域（`duiDialogTitle`），最多允许一个。
   * @zh 投影进来的标题区域（`duiDialogTitle`），最多允许一个。
   */
  @ContentChildren(duiDialogTitleDirective, { descendants: true })
  dialogTitle!: QueryList<duiDialogTitleDirective>;
  /**
   * Template/content query reference `dialogContent` (`QueryList<duiDialogContentDirective>`) targeting dialog content.
   * @zh 投影进来的内容区域（`duiDialogContent`），最多允许一个。
   * @zh 投影进来的内容区域（`duiDialogContent`），最多允许一个。
   */
  @ContentChildren(duiDialogContentDirective, { descendants: true })
  dialogContent!: QueryList<duiDialogContentDirective>;
  /**
   * Template/content query reference `dialogActions` (`QueryList<duiDialogActionsDirective>`) targeting dialog actions.
   * @zh 投影进来的操作按钮区域（`duiDialogActions`），最多允许一个。
   * @zh 投影进来的操作按钮区域（`duiDialogActions`），最多允许一个。
   */
  @ContentChildren(duiDialogActionsDirective, { descendants: true })
  dialogActions!: QueryList<duiDialogActionsDirective>;
  /**
   * Template/content query reference `dialogStatus` (`QueryList<duiDialogStatusDirective>`) targeting dialog status.
   * @zh 投影进来的状态提示区域（`duiDialogStatus`），最多允许一个。
   * @zh 投影进来的状态提示区域（`duiDialogStatus`），最多允许一个。
   */
  @ContentChildren(duiDialogStatusDirective, { descendants: true })
  dialogStatus!: QueryList<duiDialogStatusDirective>;

  /**
   * Property `_unsubscribeAll` (`Subject<void>`) storing unsubscribe all.
   * @zh 属性 `_unsubscribeAll`（类型：`Subject<void>`），用于存储或配置取消订阅全部。
   */
  private _unsubscribeAll: Subject<void>;
  /**
   * Creates an instance of `duiDialogComponent` and initializes its dependencies and internal state.
   * @zh 创建 `duiDialogComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dotosConfigService - Injected or initial dotos config service (`DotosConfigService`) / 注入或传入的DotOS配置服务（`DotosConfigService`）
   * @param _themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   */
  constructor(
    private _dotosConfigService: DotosConfigService,
    protected _themeService: ThemeService,
  ) {
    this._unsubscribeAll = new Subject();
  }
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  async ngOnInit() {

    this._dotosConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.setTheme(config);
        this._themeService.loadTheme(duiDialogTheme);
    });
  }

  /**
   * Applies the given app config's theme (primary/accent/warn colors, type, layout, form type)
   * to this dialog's theme scope.
   * @zh 将给定应用配置的主题（主色/强调色/警示色、类型、布局、表单类型）应用到该对话框的主题作用域。
   */
  setTheme(config:DotosConfig) {
    let type = config.theme.type;
    let primary = config.theme.primary;
    let accent = config.theme.accent;
    let warn = config.theme.warn;
    let page = config.layout.pagemodel;
    let formType = config.theme.formType;
    this._themeService.changeTheme(primary, accent, warn, type, page,formType);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  
  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit(): void {
    if (this.dialogTitle.length > 1) {
      throw new Error('Duplicate dui-dialog-title component at in dui-dialog.');
    }
    if (this.dialogContent.length > 1) {
      throw new Error('Duplicate dui-dialog-content component at in dui-dialog.');
    }
    if (this.dialogActions.length > 1) {
      throw new Error('Duplicate dui-dialog-actions component at in dui-dialog.');
    }
    if (this.dialogStatus.length > 1) {
      throw new Error('Duplicate dui-dialog-status component at in dui-dialog.');
    }
  }
}
