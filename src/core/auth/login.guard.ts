import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class LoginGuard  {
  constructor(private _router: Router, private authService: AuthService) { }
  canActivate(): Observable<boolean> | boolean {
    return this.authService.getRegistered().pipe(
      map(
        result => {
          if (result.registered) {
            return true;
          } else{
            this._router.navigate(['/register']);
            return false;
          }
        }
      )
    )
  }
}
