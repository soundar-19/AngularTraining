import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, map } from "rxjs";

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
    
    constructor(private http: HttpClient) { }
    
    getBugs(): Observable<Bug[]> {
        return this.http.get<any>(`${this.apiUrl}?size=100`).pipe(
            map(response => response.content || []),
            catchError(err => {
                console.error(err);
                return [];
            })
        );
    }
}
