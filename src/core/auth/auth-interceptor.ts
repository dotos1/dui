import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    public constructor(
        public storageService: LocalStorageService){
    }
    private isSameOriginOrRelativeUrl(url: string): boolean {
        if (!url || !/^https?:\/\//i.test(url)) {
            return true;
        }
        if (typeof window !== 'undefined' && window.location) {
            if (url.startsWith(window.location.origin)) {
                return true;
            }
            try {
                const parsed = new URL(url, window.location.origin);
                const currentHost = window.location.hostname;
                if (
                    parsed.hostname === currentHost ||
                    parsed.hostname === 'localhost' ||
                    parsed.hostname === '127.0.0.1' ||
                    (currentHost.includes('.') && parsed.hostname.endsWith('.' + currentHost.split('.').slice(-2).join('.')))
                ) {
                    return true;
                }
            } catch {
                return false;
            }
        }
        return false;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string =  this.storageService.get('access_token'); 
        if (token && token !== 'null' && token !== 'undefined' && this.isSameOriginOrRelativeUrl(request.url)) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }

        return next.handle(request);
    }
}