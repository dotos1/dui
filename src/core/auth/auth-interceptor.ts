import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable, Injector, Optional } from '@angular/core';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { Observable } from 'rxjs';
import { configuredTokenHosts, isTrustedTokenTarget } from './token-target';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    public constructor(
        public storageService: LocalStorageService,
        @Optional() private injector?: Injector){
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string =  this.storageService.get('access_token'); 
        if (token && token !== 'null' && token !== 'undefined' && isTrustedTokenTarget(request.url, undefined, configuredTokenHosts(this.injector))) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }

        return next.handle(request);
    }
}