import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, finalize } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProfilerInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            ok = "succeeded";
          }
        },
        () => (ok = "failed")
      ),
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${req.method} "${req.urlWithParams}"  ${ok} in ${elapsed} ms.`;
        console.log(msg);
      })
    );
  }
}
