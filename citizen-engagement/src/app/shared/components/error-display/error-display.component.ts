import { Component, OnInit, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.sass']
})
export class ErrorDisplayComponent implements OnInit {
    @Input() control: FormControl;
    @Input() form: NgForm;

    constructor() { }

    ngOnInit() {}

    public hasError(errorKey?: string) {
        return this.control?.hasError(errorKey) && this.control?.touched || this.control?.hasError(errorKey) && this.form?.submitted;
    }

    public getErrorMessage() {
        if (this.control && this.control.errors && this.control.errors.message) {
            return this.control.errors.message.value;
        }
    }

    isTouched() {
        return this.isControlDefined() && this.control.touched;
    }

    isSubmitted() {
        return this.isFormDefined() && this.form.submitted;
    }

    isServiceWorkerPhoneFormatError() {
        return this.control.errors.pattern.requiredPattern?.toString().includes("{8,14}") ?? false;
    }

    isPhoneFormatError() {
        return this.control.errors.pattern.requiredPattern?.toString().includes("{8}") ?? false;
    }

    isHotlineFormatError() {
        return this.control.errors.pattern.requiredPattern?.toString().includes("{3,8}") ?? false;
    }

    isNumberFormatError(){
        return this.control.errors.pattern.requiredPattern?.toString().includes("-9]") ?? false;
    }

    toArabic(str: any) {
        if(str)
        return str.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d]);
    }
    
    private isControlDefined() { return this.control !== undefined && this.control !== null; }
    private isFormDefined() { return this.form !== undefined && this.form !== null; }
}
