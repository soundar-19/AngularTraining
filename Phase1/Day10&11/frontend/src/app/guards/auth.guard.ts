import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const http = inject(HttpClient);
    
    if (!auth.getToken()) {
        router.navigate(['/login']);
        return false;
    }
    
    // Check server connectivity
    return http.get('http://localhost:8080/api/bugs/stats').pipe(
        map(() => true),
        catchError(() => {
            router.navigate(['/login']);
            return of(false);
        })
    );
}