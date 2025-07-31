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
import {  takeUntil } from 'rxjs/operators';
import { DotosConfigService } from '@dotos/dui/theme';
import { LockTheme } from './lockscreen.theme';
import { LocalStorageService } from '@dotos/dui/core/storage';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export const USER_STATUS_CODES = {
  400: 'User already exists',
  401: 'Invalid credentials',
  500: 'Something went wrong...'
};
@Component({
  selector: 'lock-dialog',
  templateUrl: './lockscreen.dialog.html',
  styleUrls: ['./lockscreen.dialog.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: duiAnimations,
})
export class LockscreenDialog implements OnInit,OnDestroy {
  lockForm: FormGroup;

  public style;
  public currentTime;
  public currentWeek;
  public attachOutsideOnClick = true;
  public errorDiagnostic: string;
  public submitted = false;
  public cryptType = '';
  public userName = '';
  public lt = '';
  public user='';

  from: any;
    system: any;
  private chksub: any;
  public wallpapers = [];
  public index = 1;

  private _unsubscribeAll: Subject<void>;

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

     @Inject(MAT_DIALOG_DATA) public data: any,
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

  ngOnInit() {
      this._dotosConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.themeService.changeThemeWithConfig(config);
        this.themeService.loadTheme(LockTheme);
        this.changeDetectionRef.detectChanges();
      });
      let values:any=this.localStore.get('dotosConfig');
      if(values){
        this._dotosConfigService.config=values;
      }
      
    let userCookie = CookieStorage.getCookie('user_name');
    if (userCookie && userCookie.value) {
      this.userName =userCookie.value;
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

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    if (this.chksub) {
      this.chksub.unsubscribe();
    }
  }



  onSubmit() {
    this.submitted = true;
    this.errorDiagnostic = null;
    let usrPwd = this._encrypt.md5(this.lockForm.value.password);
    this.authService.onLogin.subscribe((data: any) => {
      if (this.authService.isLoggedIn()||data.success) {
        this.dialogRef.close();
      } else {
        this.submitted = false;
        this.errorDiagnostic = data.message;
      }
    });
    this.authService.login(this.user, usrPwd, this.lt);
  }

}
