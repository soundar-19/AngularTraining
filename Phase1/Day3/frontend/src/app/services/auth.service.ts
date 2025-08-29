import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private tokenKey = 'jwt_token';
    
    constructor(private http: HttpClient) { }
    
    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { userName: username, password }).pipe(
            catchError(err => {
                console.error(err);
                throw err;
            })
        );
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
}
