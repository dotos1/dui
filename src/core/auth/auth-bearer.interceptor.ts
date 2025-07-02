
import {
  HttpHandler,
  HttpHeaderResponse,
  HttpHeaders,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { Observable, Observer, throwError as observableThrowError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthBearerInterceptor implements HttpInterceptor {
  private excludedUrlsRegex: RegExp[];

  private bearerExcludedUrls: string[] = ['auth/realms','oauth2/token', 'resources/',       
        "/login/config",
        "/login/modulefederation",
        "/wallpapers",
        "/register",
        "/oauth", 
        "/utils/file/download",
        "/checklogin", 
        'assets/', 
        '.json'
      ];

  constructor(
    private storageService: LocalStorageService) {

  }

  private loadExcludedUrlsRegex() {
    const excludedUrls: string[] = this.getBearerExcludedUrls();
    this.excludedUrlsRegex = excludedUrls.map(urlPattern => new RegExp(urlPattern, 'gi')) || [];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
      
    
    const urlRequest = req.url;
    if (!this.getBearerExcludedUrls()) {
      return next.handle(req);
    }
    const excludedUrls: string[] = this.getBearerExcludedUrls();
    const excludedUrlsRegex = excludedUrls.map(urlPattern => new RegExp(urlPattern, 'gi')) || [];
    const shallPass: boolean = !!excludedUrlsRegex.find(regex => regex.test(urlRequest));
    if (shallPass) {
      return next.handle(req)
        .pipe(
          catchError((error) => observableThrowError(error))
        );
    }

    return this.addTokenToHeader(req.headers)
      .pipe(
        mergeMap((headersWithBearer) => {
          const headerWithContentType = this.appendJsonContentType(headersWithBearer);

          const kcReq = req.clone({ headers: headerWithContentType});
          return next.handle(kcReq)
            .pipe(
              catchError((error) => {
                return observableThrowError(error);
              })
           );
      })
      );
  }
  getBearerExcludedUrls(): string[] {
    return this.bearerExcludedUrls;
}
  private appendJsonContentType(headers: HttpHeaders): HttpHeaders {
    return headers;
 //   return headers.set('Content-Type', 'application/json;charset=UTF-8');
  }
  addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
    return new Observable((observer: Observer<any>) => {
        let headers = headersArg;
        if (!headers) {
            headers = new HttpHeaders();
        }
        try {
            const token: string =  this.storageService.get('access_token'); 
            if(token!=null){
              headers = headers.set('Authorization', 'Bearer ' + token);
            }
      
            observer.next(headers);
            observer.complete();
        } catch (error) {
            observer.error(error);
        }
    });
}
}
