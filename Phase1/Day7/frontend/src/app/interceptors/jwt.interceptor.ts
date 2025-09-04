import { HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    static withToken: HttpInterceptorFn = (req, next) => {
        const authService = inject(AuthService);
        const token = localStorage.getItem("jwt_token");
        
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        
        return next(req).pipe(
            catchError(error => {
                if (error.status === 401 || error.status === 403) {
                    authService.logout();
                }
                return throwError(() => error);
            })
        );
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem("jwt_token"); 
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(req);
    }
}
