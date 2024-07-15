import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class RegisterGuard  {
  constructor(private _router: Router, private authService: AuthService) { }
  canActivate(): Observable<boolean> | boolean {
    return this.authService.getRegistered().pipe(
      map(
        result => {
          if (result.registered) {
            this._router.navigate(['/login']);
            return false;
          } else{
            return true;
          }
        }
      )
    )
  }
}
