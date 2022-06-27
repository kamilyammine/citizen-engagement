import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minMaxValidator(minLength: number, maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value) {
            const value = parseArabic(control.value);
            if (minLength && maxLength) {
                return value <= maxLength && value >= minLength ? null : {
                    length: {
                        valid: false
                    },
                    minLength: minLength,
                    maxLength: maxLength
                };
            }
            if (minLength && !maxLength) {
                return value >= minLength ? null : {
                    length: {
                        valid: false
                    },
                    minLength,
                };
            }

            if (!minLength && maxLength) {
                return value <= maxLength ? null : {
                    length: {
                        valid: false
                    },
                    maxLength
                };
            }
        }
    };

}

const parseArabic = str => {
    if (str) {
        return Number(str.toString().replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
            return d.charCodeAt(0) - 1632; // Convert Arabic numbers
        }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
            return d.charCodeAt(0) - 1776; // Convert Persian numbers
        }));
    }
};

export function noEmptySpace(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (control?.value) {
            const v = `${control.value}`;
            if (v.trim() === '') {
                return { 'whitespace': true };
            }
        } else {
            return null;
        }
    };
}

export function onlyNumbersWithoutEmptySpace(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (control?.value) {
            const v = `${control.value}`;
            if (v === '') {
                return null;
            }
            if (v.trim() === '') {
                return { message: {value: 'errors.no_empty_spaces' }};
            }
            if (!v.match(/^([\u0660-\u0669]+|[0-9]+)$/)) {
                return { message: {value: 'form_errors.number_formatting' }};
            }
        } else {
            return null;
        }
    };
}
export function phoneNumberWithoutEmptySpace(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (control?.value) {
            const v = `${control.value}`;
            if (v === '') {
                return null;
            }
            if (v.trim() === '') {
                return { message: {value: 'errors.no_empty_spaces' }};
            }
            if (!v.match(/^([\u0660-\u0669]|[0-9]){8}$/)) {
                return { message: {value: 'form_errors.incorrect_format' }};
            }
        } else {
            return null;
        }
    };
}
export function emailWithoutEmptySpace(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (control?.value) {
            const v = `${control.value}`;
            if (v === '') {
                return null;
            }
            if (v.trim() === '') {
                return { message: {value: 'errors.no_empty_spaces' }};
            }
            if (!v.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
                return { message: {value: 'form_errors.incorrect_format' }};
            }
        } else {
            return null;
        }
    };
}

export function dashSlashNumbers(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (control?.value) {
            const v = `${control.value}`;
            if (v === '') {
                return null;
            }
            if (v.trim() === '') {
                return { message: {value: 'errors.no_empty_spaces' }};
            }
            if (!v.match(/^[\u0660-\u06690-9/-]*$/)) {
                return { message: {value: 'form_errors.incorrect_format' }};
            }
        } else {
            return null;
        }
    }
}
export function dashSlashNumbersLetters(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (control?.value) {
            const v = `${control.value}`;
            if (v === '') {
                return null;
            }
            if (v.trim() === '') {
                return { message: {value: 'errors.no_empty_spaces' }};
            }
            if (!v.match(/^[\u0660-\u0669a-zA-Z0-9/-]*$/)) {
                return { message: {value: 'form_errors.incorrect_format' }};
            }
        } else {
            return null;
        }
    };
}

export function onlyOneNumberRequired(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (
            (control.root.get('MonetaryNumber')?.value && control.root.get('MonetaryNumber')?.value !== '')
         || (control.root.get('AutoNumber')?.value && control.root.get('AutoNumber')?.value !== '')) {
            return null;
        } else {
           return {'message': {value: 'errors.monetary_number_required'}}
        }
    };
}

export function requiredTrueValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (control.value !== true) {
            return {requiredTrue: true}
        } 
        return null;
    };
}

export const atLeastOne = (validator: ValidatorFn, controls:string[] = null) => (
    group: FormGroup,
  ): ValidationErrors | null => {
    if(!controls){
      controls = Object.keys(group.controls)
    }

    const hasAtLeastOne = group && group.controls && controls
      .some(k => !validator(group.controls[k]));

    return hasAtLeastOne ? null : {
      atLeastOne: true,
    };
  };
