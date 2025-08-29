import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, map } from "rxjs";
import { AuthService } from './auth.service';

export interface Bug {
    id: number;
    title: string; 
    status: string;
    assignee: string;
    project: string;
}

@Injectable({ providedIn: 'root' })
export class BugService {
    private apiUrl = 'http://localhost:8080/api/bugs';
    
    constructor(private http: HttpClient, private authService: AuthService) { }
    
    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': token ? `Bearer ${token}` : ''
        });
    }
    
    getBugs(): Observable<Bug[]> {
        return this.http.get<any>(`${this.apiUrl}?size=100`, { headers: this.getHeaders() }).pipe(
            map(response => response.content || []),
            catchError(err => {
                console.error(err);
                return [];
            })
        );
    }
}
