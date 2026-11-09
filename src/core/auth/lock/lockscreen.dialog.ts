/**
 * @fileoverview Module `src/core/auth/lock/lockscreen.dialog.ts` providing lockscreen dialog definitions and implementation.
 * @zh 模块文件 `src/core/auth/lock/lockscreen.dialog.ts`，提供lockscreen对话框相关的定义与实现。
 */

import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { duiAnimations } from '@dotos/dui/common/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationService } from '@dotos/dui/translator';
import { Router } from '@angular/router';
import { encrypt } from '@dotos/dui/core/crypt';
import { CookieStorage } from '@dotos/dui/core/cookie';
import { Subject } from 'rxjs';
import { AuthService } from '@dotos/dui/core/auth';
import { ThemeService } from '@dotos/dui/theme';
import {  take, takeUntil } from 'rxjs/operators';
import { DotosConfigService } from '@dotos/dui/theme';
import { LockTheme } from './lockscreen.theme';
import { LocalStorageService } from '@dotos/dui/core/storage';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


/**
 * Constant/variable `USER_STATUS_CODES` defining user status codes in `src/core/auth/lock`.
 * @zh 常量/变量 `USER_STATUS_CODES`，定义 `src/core/auth/lock` 中的用户状态编码。
 */
export const USER_STATUS_CODES = {
  400: 'User already exists',
  401: 'Invalid credentials',
  500: 'Something went wrong...'
};
/**
 * Angular component `LockscreenDialog` (selector: 'lock-dialog') providing lockscreen dialog presentation and interaction in `src/core/auth/lock`.
 * @zh Angular 组件 `LockscreenDialog`（selector: 'lock-dialog'），提供Lockscreen对话框的视图渲染与交互逻辑（位于 `src/core/auth/lock`）。
 */
@Component({
  selector: 'lock-dialog',
  templateUrl: './lockscreen.dialog.html',
  styleUrls: ['./lockscreen.dialog.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: duiAnimations,
})
export class LockscreenDialog implements OnInit,OnDestroy {
  /**
   * Property `lockForm` (`FormGroup<any>`) storing lock form.
   * @zh 属性 `lockForm`（类型：`FormGroup<any>`），用于存储或配置锁定表单。
   */
  lockForm: FormGroup;

  /**
   * Property `style` (`any`) storing style.
   * @zh 属性 `style`（类型：`any`），用于存储或配置样式。
   */
  public style;
  /**
   * Property `currentTime` (`any`) storing current time.
   * @zh 属性 `currentTime`（类型：`any`），用于存储或配置当前时间。
   */
  public currentTime;
  /**
   * Property `currentWeek` (`any`) storing current week.
   * @zh 属性 `currentWeek`（类型：`any`），用于存储或配置当前周。
   */
  public currentWeek;
  /**
   * Property `attachOutsideOnClick` (`boolean`) storing attach outside on click (default: `true`).
   * @zh 属性 `attachOutsideOnClick`（类型：`boolean`），用于存储或配置挂载外部当点击（默认值：`true`）。
   */
  public attachOutsideOnClick = true;
  /**
   * Property `errorDiagnostic` (`string`) storing error diagnostic.
   * @zh 属性 `errorDiagnostic`（类型：`string`），用于存储或配置错误Diagnostic。
   */
  public errorDiagnostic: string;
  /**
   * Property `submitted` (`boolean`) storing submitted (default: `false`).
   * @zh 属性 `submitted`（类型：`boolean`），用于存储或配置submitted（默认值：`false`）。
   */
  public submitted = false;
  /**
   * Property `cryptType` (`string`) storing crypt type (default: `''`).
   * @zh 属性 `cryptType`（类型：`string`），用于存储或配置crypt类型（默认值：`''`）。
   */
  public cryptType = '';
  /**
   * Property `userName` (`string`) storing user name (default: `''`).
   * @zh 属性 `userName`（类型：`string`），用于存储或配置用户名称（默认值：`''`）。
   */
  public userName = '';
  /**
   * Property `lt` (`string`) storing lt (default: `''`).
   * @zh 属性 `lt`（类型：`string`），用于存储或配置lt（默认值：`''`）。
   */
  public lt = '';
  /**
   * Property `user` (`string`) storing user (default: `''`).
   * @zh 属性 `user`（类型：`string`），用于存储或配置用户（默认值：`''`）。
   */
  public user='';

  /**
   * Property `from` (`any`) storing from.
   * @zh 属性 `from`（类型：`any`），用于存储或配置从。
   */
  from;
    /**
     * Property `system` (`any`) storing system.
     * @zh 属性 `system`（类型：`any`），用于存储或配置system。
     */
    system;
  /**
   * Property `chksub` (`any`) storing chksub.
   * @zh 属性 `chksub`（类型：`any`），用于存储或配置chksub。
   */
  private chksub;
  /**
   * Property `wallpapers` (`any[]`) storing wallpapers (default: `[]`).
   * @zh 属性 `wallpapers`（类型：`any[]`），用于存储或配置wallpapers（默认值：`[]`）。
   */
  public wallpapers = [];
  /**
   * Property `index` (`number`) storing index (default: `1`).
   * @zh 属性 `index`（类型：`number`），用于存储或配置索引（默认值：`1`）。
   */
  public index = 1;

  /**
   * Property `_unsubscribeAll` (`Subject<void>`) storing unsubscribe all.
   * @zh 属性 `_unsubscribeAll`（类型：`Subject<void>`），用于存储或配置取消订阅全部。
   */
  private _unsubscribeAll: Subject<void>;

  /**
   * Creates an instance of `LockscreenDialog` and initializes its dependencies and internal state.
   * @zh 创建 `LockscreenDialog` 实例，并初始化其依赖项与内部状态。
   * @param authService - Injected or initial auth service (`AuthService`) / 注入或传入的认证服务（`AuthService`）
   * @param _dotosConfigService - Injected or initial dotos config service (`DotosConfigService`) / 注入或传入的DotOS配置服务（`DotosConfigService`）
   * @param _formBuilder - Injected or initial form builder (`FormBuilder`) / 注入或传入的表单构建器（`FormBuilder`）
   * @param _router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param _encrypt - Injected or initial encrypt (`encrypt`) / 注入或传入的encrypt（`encrypt`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param changeDetectionRef - Injected or initial change detection ref (`ChangeDetectorRef`) / 注入或传入的变更变更检测引用（`ChangeDetectorRef`）
   * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
   * @param dialogRef - Injected or initial dialog ref (`MatDialogRef<LockscreenDialog, any>`) / 注入或传入的对话框引用（`MatDialogRef<LockscreenDialog, any>`）
   * @param data - Injected or initial data (`any`) / 注入或传入的数据（`any`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(
    private authService: AuthService,
    private _dotosConfigService: DotosConfigService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _encrypt: encrypt,
    public themeService: ThemeService,
    protected changeDetectionRef: ChangeDetectorRef,
    public localStore: LocalStorageService,
    public dialogRef: MatDialogRef<LockscreenDialog>,

     @Inject(MAT_DIALOG_DATA) public data,
    protected translateService: TranslationService) {
    this._unsubscribeAll = new Subject();
    this.from=data.from;
    this.system=data.system;
    this.lockForm = this._formBuilder.group({
      username: [
        {
          value: '',
          disabled: true
        }, Validators.required
      ],
      password: ['', Validators.required]
    });
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
      this._dotosConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.themeService.changeThemeWithConfig(config);
        this.themeService.loadTheme(LockTheme);
        this.changeDetectionRef.detectChanges();
      });
      let values=this.localStore.get('dotosConfig');
      if(values){
        this._dotosConfigService.config=values;
      }
      
    let userCookie = CookieStorage.getCookie('user_name');
    let resolvedUserName = this.sanitizeUserName(userCookie ? userCookie.value : '');
    if (!resolvedUserName) {
      resolvedUserName = this.sanitizeUserName(this.authService.getUsername())
        || this.sanitizeUserName((this.localStore.get('imlogin') as any)?.username)
        || this.sanitizeUserName(this.localStore.get('USERNAME') as string);
    }
    if (resolvedUserName) {
      this.userName = resolvedUserName;
      if (!userCookie || userCookie.value !== resolvedUserName) {
        CookieStorage.addCookie({ key: 'user_name', value: resolvedUserName });
      }
      if (this. system) {
         let domain =this. system.domain;
        this.user = this.userName+"@"+domain;
        this.lt =this. system.ticket;
        this.cryptType = this.system.cryptType;
        let userNameField=this.lockForm.controls['username'];
        userNameField.patchValue(this.userName);
      }else{
       this._router.navigate(['/login']);
      }
    } else {
      this._router.navigate(['/login']);
    }
  }

  private sanitizeUserName(raw: any): string {
    if (typeof raw !== 'string') {
      return '';
    }
    let val = raw.trim();
    while (val.length >= 2 && val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1).trim();
    }
    const atIdx = val.indexOf('@');
    if (atIdx !== -1) {
      val = val.substring(0, atIdx).trim();
    }
    return val;
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    if (this.chksub) {
      this.chksub.unsubscribe();
    }
  }



  /**
   * Executes `onSubmit` to handle on submit.
   * @zh 执行 `onSubmit`，用于当提交。
   */
  onSubmit() {
    this.submitted = true;
    this.errorDiagnostic = null;
    let usrPwd = this._encrypt.md5(this.lockForm.value.password);
    this.authService.onLogin.pipe(takeUntil(this._unsubscribeAll), take(1)).subscribe((data: { success?; type?; message?; reason? }) => {
      if (data && (data.success || ((data as unknown) !== false && data.success !== false && data.type !== 'unauthorized' && this.authService.isLoggedIn()))) {
        this.dialogRef.close();
      } else {
        this.submitted = false;
        this.errorDiagnostic = data ? (data.message || data.reason) : undefined;
      }
    });
    this.authService.login(this.user, usrPwd, this.lt);
  }

}
