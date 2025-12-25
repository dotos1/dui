import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
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
    if (req.url.indexOf('timeout')!==-1) {
      return next.handle(req);
    }else{
        return next.handle(req).pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            if (error.status !== 401) {
              this.toastr.error(error.message);
            }else{
              
            }
            return throwError(error);
          })
        );
      }
    }
}
