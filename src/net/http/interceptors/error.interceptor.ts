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
import { Router } from "@angular/router";
import { LockscreenDialog } from "dist/dui/core/auth/lock";
import { DialogService } from "@dotos/dui/common/dialogs";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    public dialogService: DialogService,
  ) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          this.toastr.error(error.message);
        }else{
            this.dialogService.open(
              LockscreenDialog, {
                width: '420px',
                height: '360px',
                data: {
                  from: this.router.url
                },
           })
         
        }
        return throwError(error);
      })
    );
  }
}
