import { Component, Input, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.sass']
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() placeholdertext: string;
  @Input() formControlName: string
  @Input() isPassword: boolean
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
   }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }

  fieldInvalid(): boolean {
    const field = this.ngControl.control;
    return field.touched && field.invalid;
    
  }

  fieldRequired() {
    const field = this.ngControl.control
    if(field['validator']){
      const validator =  field.validator({} as AbstractControl)
      if (validator && validator.required) {
        return true;
      }
    } return false;
  }
}
