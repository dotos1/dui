
import { forwardRef, Inject, resolveForwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigLoader } from '../config.loader';

export class ConfigHttpLoader implements ConfigLoader {
  constructor(@Inject(forwardRef(() => HttpClient)) private readonly http: HttpClient,
              private readonly endpoint: string = '/config.json') {
  }

  loadSettings(): any {
    return new Promise((resolve, reject) => {
      const http = resolveForwardRef(this.http);

      http.get(this.endpoint)
        .subscribe(
        (res: any) => resolve(res),
        (res: any) => {
          reject(res)
        });
    });
  }
}
