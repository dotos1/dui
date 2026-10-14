import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from "@dotos/dui/common/toastr";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,

  ) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.indexOf('timeout') !== -1) {
      return next.handle(req);
    } else {
      const isIdempotent = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
      let retried = false;
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (!retried && isIdempotent && !(error.status >= 400 && error.status < 500)) {
            retried = true;
            return next.handle(req);
          }
          return throwError(error);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status !== 401) {
            this.toastr.error(error.message);
          }
          return throwError(error);
        })
      );
    }
  }
}
