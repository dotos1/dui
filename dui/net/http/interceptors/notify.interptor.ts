import { Injectable,Injector } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from "@angular/common/http";
import { Observable, of} from "rxjs";

import { ToastrService } from "@dotos/dui/common/toastr";
import { TranslationService } from '@dotos/dui/translator';
import { last, tap } from 'rxjs/operators';

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

@Injectable({ providedIn: 'root' })
export class NotifyInterceptor implements HttpInterceptor {


  constructor(
    private toastr: ToastrService,
    private injector: Injector,
    private translateService: TranslationService
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
      last(),
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!(event.body instanceof Blob) && !(event.body instanceof ArrayBuffer)) {
            if (event.status === 200) {
              if (event.body&&event.body.success) {
                let type = req.params.get('type');
                this.translateService=this.injector.get(TranslationService);

                  if (type == 'updatesave') {
                    this.toastr.success(this.translateService.instant("FORM.UPDATESUCCESS"));
                  } else if (type == 'delete') {
                    this.toastr.success(this.translateService.instant("FORM.DELETESUCCESS"));
                  } else if (type == 'save') {
                    this.toastr.success(this.translateService.instant("FORM.SAVESUCCESS"));
                  }
 
              }
              // else {
              //   this.toastr.error(this.translateService.instant("FORM.FAIL"), event.body.message);
              // }
            }
          }
        }
      })
    );
  }
}
