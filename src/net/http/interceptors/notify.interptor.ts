import { Injectable,Injector } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from "@angular/common/http";
import { Observable} from "rxjs";
import { ToastrService } from "@dotos/dui/common/toastr";
import { TranslationService } from '@dotos/dui/translator';
import { tap } from 'rxjs/operators';

export function tapOnce<T>(fn: (v: T) => any) {
  return (source$: Observable<T>) => {
    let isFirst = true;
    return source$.pipe(
      tap(v => {
        if (isFirst) {
          fn(v);
          isFirst = false;
        }
      })
    );
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotifyInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    ) {
    
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
   if (req.method == "GET") {
      return next.handle(req);
    }
    return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!(event.body instanceof Blob) && !(event.body instanceof ArrayBuffer)) {
            if (event.status === 200) {
              if (event.body && event.body.success) {
                let type = req.params.get('type');
                const toastr = this.injector.get(ToastrService);
                const translateService = this.injector.get(TranslationService);

                if (type == 'updatesave') {
                  toastr.success(translateService.instant("FORM.UPDATESUCCESS"));
                } else if (type == 'delete') {
                  toastr.success(translateService.instant("FORM.DELETESUCCESS"));
                } else if (type == 'save') {
                  toastr.success(translateService.instant("FORM.SAVESUCCESS"));
                }
              }
            }
          }
        }
      })
    );
  }
}
