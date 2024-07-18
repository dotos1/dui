import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from './translate.service';

@Injectable()
export class TranslateGuard  {
  constructor(private _router: Router, private translateService: TranslateService) { }
  canActivate(): Observable<boolean> | boolean {
    return this.translateService.loadingTranslations.pipe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(result => {
          return true;
        }
      )
    )
  }
}
