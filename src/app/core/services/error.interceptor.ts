import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let errorMessage: string = err.status + " " + err.statusText;
            if (err.error && typeof err.error === 'object' && err.error !== null && 'message' in err.error) {
                errorMessage = err.error.message;
            } else if (err.name) {
                errorMessage += ' ' + err.name;
            }

            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                this.router.navigate(['/']).then(() => {
                    window.location.reload();
                });
            }
            
            this.alertService.error(errorMessage, true);

            return throwError(err);
        }));
    }
}
