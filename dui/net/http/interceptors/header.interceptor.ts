import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method == "POST") {
      return next.handle(req);
    }
    const modified = req.clone({ setHeaders: {'Content-Type': 'application/x-www-form-urlencoded'} });
    return next.handle(modified);
  }
}
