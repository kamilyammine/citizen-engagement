import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpResponse,
    HttpErrorResponse,
    HttpEvent,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

    constructor(
        public spinnerService: SpinnerService,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const showLoader = request.headers.get('showLoader') ? request.headers.get('showLoader').toLowerCase() === 'true' : false;
        const showLoader = true;
        if (showLoader) { this.spinnerService.pushRequest(request); }
        return next.handle(request).pipe(
            tap((response: HttpEvent<any>) => {
                    if (
                        (response instanceof HttpResponse) ||
                        (response instanceof HttpErrorResponse)
                    ) {
                        if (showLoader) { this.spinnerService.popRequest(); }
                    }
                    return response;
                }
            ), catchError((error) => {
                if (showLoader) { this.spinnerService.popAllRequest(); }
                return throwError(error);
            })
        );
    }

}
