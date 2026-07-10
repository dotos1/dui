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
/** @zh 标记 `dui-dialog` 内容投影中的标题区域。 */
@Directive({ selector: '[duiDialogTitle]' })

export class duiDialogTitleDirective {}

/** @zh 标记 `dui-dialog` 内容投影中的主体内容区域。 */
@Directive({ selector: '[duiDialogContent]' })
export class duiDialogContentDirective {}

/** @zh 标记 `dui-dialog` 内容投影中的操作按钮区域。 */
@Directive({ selector: '[duiDialogActions]' })
export class duiDialogActionsDirective {}

/** @zh 标记 `dui-dialog` 内容投影中的状态提示区域。 */
@Directive({ selector: '[duiDialogStatus]' })
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

})
export class duiDialogComponent implements AfterContentInit ,OnInit,OnDestroy{
  @ContentChildren(duiDialogTitleDirective, { descendants: true })
  dialogTitle!: QueryList<duiDialogTitleDirective>;
  @ContentChildren(duiDialogContentDirective, { descendants: true })
  dialogContent!: QueryList<duiDialogContentDirective>;
  @ContentChildren(duiDialogActionsDirective, { descendants: true })
  dialogActions!: QueryList<duiDialogActionsDirective>;
  @ContentChildren(duiDialogStatusDirective, { descendants: true })
  dialogStatus!: QueryList<duiDialogStatusDirective>;

  private _unsubscribeAll: Subject<void>;
  constructor(
    private _dotosConfigService: DotosConfigService,
    protected _themeService: ThemeService,
  ) {
    this._unsubscribeAll = new Subject();
  }
  async ngOnInit() {

    this._dotosConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.setTheme(config);
        this._themeService.loadTheme(duiDialogTheme);
    });
  }

  setTheme(config:DotosConfig) {
    let type = config.theme.type;
    let primary = config.theme.primary;
    let accent = config.theme.accent;
    let warn = config.theme.warn;
    let page = config.layout.pagemodel;
    let formType = config.theme.formType;
    this._themeService.changeTheme(primary, accent, warn, type, page,formType);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  
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
