import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, { response: any; expiry: number }>();
  private readonly maxEntries = 200;
  private readonly ttlMs = 5 * 60 * 1000;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method !== "GET") {
      return next.handle(req);
    }
    const cacheKey = req.urlWithParams;
    const cachedResponse = this.getFromCache(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.setInCache(cacheKey, event);
        }
      })
    );
  }

  private getFromCache(url: string): any {
    const entry = this.cache.get(url);
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiry) {
      this.cache.delete(url);
      return undefined;
    }
    return entry.response;
  }

  private setInCache(url: string, response: any): void {
    if (this.cache.size >= this.maxEntries) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(url, { response, expiry: Date.now() + this.ttlMs });
  }
}
