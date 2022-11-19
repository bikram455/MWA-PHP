import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor(private _auth: AuthenticationService) {}
    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(httpRequest.method, httpRequest.url);
        return next.handle(httpRequest.clone({setHeaders: {authorization: `bearer ${this._auth.token}`}}));
    }
    
}