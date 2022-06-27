import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerService {
    private pendingRequests: HttpRequest<any>[] | any[] = [];

    constructor(
        public spinnerService: NgxSpinnerService,
    ) {
    }   

    pushRequest(req: HttpRequest<any> | any) {
        this.pendingRequests.push(req);
        this.show();
    }

    popRequest() {
        this.pendingRequests.pop();
        this.updateSpinnerVisibility();
    }

    popAllRequest() {
        this.pendingRequests = [];
        this.updateSpinnerVisibility();
    }

    getNumberOfPendingRequests(): number {
        return this.pendingRequests != null ? this.pendingRequests.length : 0;
    }

    getPendingRequests(): HttpRequest<any>[] {
        return this.pendingRequests;
    }

    private show() {
        this.spinnerService.show();
    }

    private hide() {
        this.spinnerService.hide();
    }

    resetPendingRequests(){
        this.pendingRequests = [];
        this.updateSpinnerVisibility();
    }

    private updateSpinnerVisibility() {
        const numberOfPendingRequests = this.getNumberOfPendingRequests();
        if (numberOfPendingRequests === 0) {
            this.hide();
        }
    }
}
