import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable, map, of } from "rxjs";
export interface Comment {
  id?: number;
  author: string;
  message: string;
  createdAt: string;
}
export interface Bug {
    id: number;
    title: string;
    description?: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
    assignee: string;
    project: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    Comments?: Comment[];
}

export interface BugPage {
    content: Bug[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface BugStats {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
    high: number;
    medium: number;
    low: number;
}

export interface SearchParams {
    status?: string;
    priority?: string;
    assignee?: string;
    project?: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string;
}

@Injectable({ providedIn: 'root' })
export class BugService {
  private apiUrl = 'http://localhost:8080/api/bugs';

  constructor(private http: HttpClient) {}

  getBugs(params: SearchParams = {}): Observable<BugPage> {
    let httpParams = new HttpParams();

    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.priority) httpParams = httpParams.set('priority', params.priority);
    if (params.assignee) httpParams = httpParams.set('assignee', params.assignee);
    if (params.project) httpParams = httpParams.set('project', params.project);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params.size) httpParams = httpParams.set('size', params.size.toString());
    if (params.sort) httpParams = httpParams.set('sort', params.sort);

    return this.http.get<BugPage>(this.apiUrl, { params: httpParams }).pipe(
      catchError((err) => {
        console.error('Error fetching bugs:', err);
        return of({
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 0,
          number: 0,
          first: true,
          last: true,
        });
      })
    );
  }

  getBugStatistics(): Observable<BugStats> {
    return this.http.get<BugStats>(`${this.apiUrl}/stats`).pipe(
      catchError((err) => {
        console.error('Error fetching stats:', err);
        return of({ total: 0, open: 0, inProgress: 0, closed: 0, high: 0, medium: 0, low: 0 });
      })
    );
  }

  createBug(bug: Partial<Bug>): Observable<Bug> {
    return this.http.post<Bug>(`${this.apiUrl}/admin`, bug).pipe(
      catchError((err) => {
        console.error('Error creating bug:', err);
        throw err;
      })
    );
  }

  updateBug(id: number, bug: Partial<Bug>): Observable<Bug> {
    return this.http.put<Bug>(`${this.apiUrl}/admin/${id}`, bug).pipe(
      catchError((err) => {
        console.error('Error updating bug:', err);
        throw err;
      })
    );
  }

  deleteBug(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.error('Error deleting bug:', err);
        throw err;
      })
    );
  }

  updateBugStatus(id: number, status: string): Observable<Bug> {
    return this.http.put<Bug>(`${this.apiUrl}/developer/${id}/status?status=${status}`, {}).pipe(
      catchError((err) => {
        console.error('Error updating bug status:', err);
        throw err;
      })
    );
  }

  addComment(bugId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${bugId}/comments`, comment).pipe(
      catchError((err) => {
        console.error('Error adding comment:', err);
        throw err;
      })
    );
  }
  getBugById(id: number): Observable<Bug>{
    return this.http.get<Bug>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Error fetching bug:', err);
        throw err;
      })
    );
  }
}
