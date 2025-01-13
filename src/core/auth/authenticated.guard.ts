import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CookieStorage } from '@dotos/dui/core/cookie';
import { AuthService } from './auth.service';
import { LocalStorageService } from '../storage';
import { StorageService } from '../services/storage.service';
@Injectable()
export class AuthenticatedGuard  {
  constructor(private _router: Router,
    public storage: StorageService,
    private authService: AuthService) { }
  canActivate(): Observable<boolean> | boolean {
    return this.authService.getAuthenticated().pipe(
      map(
        (result) => {
          if (result.authenticated) {
            return true;
          } else {
            if (CookieStorage.hasCookie('user_id')) {
              this.storage.removeItem('access_token');
              this.storage.removeItem('access_token_expires_in');
              this.storage.removeItem('access_token_stored_at');
              this._router.navigate(['/lock', this._router.url]);
            } else {
              this._router.navigate(['/login']);
            }
            return false;
          }
        },
      ),
      catchError((e: any) => {
        console.log(e);

        if(e.status==401||e.status==400){
          this.storage.removeItem('access_token');
          this.storage.removeItem('access_token_expires_in');
          this.storage.removeItem('access_token_stored_at');
          this._router.navigate(['/lock', this._router.url]);
        }else{
          this._router.navigate(['/maintenance', document.URL]);
        }
        return of(false);
      })
    );
  }
}
