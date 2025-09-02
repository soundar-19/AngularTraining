import { parse } from './../../../node_modules/zod/src/v4/classic/parse';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private tokenKey = 'jwt_token';
    
    constructor(private http: HttpClient, private router: Router) { }
    
    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { userName: username, password }).pipe(
            catchError(err => {
                console.error(err);
                throw err;
            })
        );
    }
    
    logout(): void {
        this.removeToken();
        this.router.navigate(['/login']);
    }
    
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
    
    getUsername(): string {
        const token = this.getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.sub || 'User';
            } catch (e) {
                return 'User';
            }
        }
        return 'User';
    }
    
    storeToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }
    
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
    
    removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    getUserRole(): string | null{
        const token = this.getToken();
        if (!token) { 
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || null;
        } catch {
            return null;
        }
    }
}
