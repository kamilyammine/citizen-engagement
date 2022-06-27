import { Component, Input, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.sass']
})
export class DropdownInputComponent implements ControlValueAccessor {
  @Input() placeholdertext: string;
  @Input() formControlName: string;
  @Input() dropDownOptions: any[];
  @Input() value: any;
  @Input() multiple = false;
  @Input() label: string;
  searchValue: string
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

  public selectAllClicked(isSelectAll: boolean) {
    const field = this.ngControl.control
    isSelectAll ? field.setValue(this.dropDownOptions) : field.reset();
  }

  public resetSearchValue() {
    if (this.searchValue !== '') {
      this.searchValue = '';
    }
  }
}
