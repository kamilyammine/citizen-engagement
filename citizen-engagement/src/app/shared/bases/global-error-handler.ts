import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    handleError(error: any): void {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;

        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
        else { 
            super.handleError(error) }
        // other stuff for error handling.
    }
}