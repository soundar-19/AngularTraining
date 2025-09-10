import { MessageService } from 'primeng/api';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class ErrorInterceptor {
    static withErrorHandling(messageService: MessageService,router : Router) : HttpInterceptorFn{
        return (req, next) => {
            return next(req).pipe(
                catchError((error) => {
                    if (error.status === 0 || !error.status) {
                        messageService.add({ severity: 'error', summary: 'Server Unavailable', detail: 'Cannot connect to server. Please try again later.' });
                        router.navigate(['/login']);
                    } else if (error.status === 401) {
                        messageService.add({ severity: 'error', summary: 'Unauthorized', detail: 'Please log in again' });
                        router.navigate(['/login']);
                    } else if (error.status === 403) {
                        messageService.add({ severity: 'error', summary: 'Access Denied', detail: 'You do not have permission to access this resource' });
                        router.navigate(['/unauthorized']);
                    } else if (error.status === 500) {
                        messageService.add({ severity: 'error', summary: 'Server Error', detail: 'Internal server error. Please try again later.' });
                    } else {
                        messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred. Please try again.' });
                    }
                    return throwError(error);
                })
            );
        };  
    }

}