import { SimpleChanges } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { LanguageHelper } from './lang.helper';
// import { BoolEquivalentString } from '../constants';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot } from '@angular/router';

export class FrameworkHelper extends LanguageHelper {

    static clearFormConfig(formConfig: any) {
        const formConfigIsDefined = this.isDefined(formConfig);
        if (formConfigIsDefined) {
            Object.keys(formConfig).forEach(prop => {
                const obj = formConfig[prop];
                this.clearFormConfigObjectProperty(obj);
            });
        }
        return formConfig;
    }

    static clearFormConfigObjectProperty(obj: any) {
        const objIsDefined = this.isDefined(obj);
        if (objIsDefined) {
            if (obj instanceof FormControl) {
                // (obj as FormControl).reset();
            }
        }
    }

    static inputValueChanged(changes: SimpleChanges, inputName: string) {
        const isChangesDefined = this.isDefined(changes);
        const isInputNameDefined = this.isDefined(inputName);
        if (isChangesDefined && isInputNameDefined) {
            const inputChanges = changes[inputName];
            const isInputChangesDefined = this.isDefined(inputChanges);
            if (isInputChangesDefined) {
                return inputChanges.previousValue !== inputChanges.currentValue;
            }
        }
        return false;
    }

    static areEntitiesStrictlyDifferent(firstEntity: any, secondEntity: any) {
        return firstEntity !== secondEntity;
    }

    static areArraysDifferent(firstArray: any[], secondArray: any[]) {
        const areEligibileArrays = this.areDefined([firstArray, secondArray]) &&
            this.isArray(firstArray) &&
            this.isArray(secondArray);
        return areEligibileArrays ? firstArray.length !== secondArray.length : true;
    }

    static unsubscribe(subscription: Subscription) {
        if (this.isDefined(subscription)) {
            subscription.unsubscribe();
        }
    }

    static unsubscribeAll(subscriptions: Subscription[]) {
        if (this.isDefined(subscriptions)) {
            subscriptions.forEach(
                subscription => this.unsubscribe(subscription)
            );
        }
    }

    static getBody<BodyModel>(response: HttpResponse<BodyModel>): BodyModel {
        return this.getPropValueIfObjIsDefined(response, 'body');
    }

    static getHeaders(response: HttpResponse<any>): HttpHeaders {
        return this.getPropValueIfObjIsDefined(response, 'headers');
    }

    static getFromBody(response: HttpResponse<any>, prop: string) {
        return this.getPropValueIfObjIsDefined(this.getBody(response), prop);
    }

    static getFromHeader(response: HttpResponse<any>, prop: string) {
        return this.getHeaders(response).get(prop);
    }

    static getFromHeaderAndParse(response: HttpResponse<any>, dotSeperatedProps: string) {
        let value;
        const headers = this.getHeaders(response);
        if (this.isObjAndPropDefined(headers, dotSeperatedProps)) {
            const props = dotSeperatedProps.split('.');
            const header = this.parse(this.getFromHeader(response, props.shift()));
            value = props.reduce((prev, currProp) => {
                return this.isPropPartOfThisObj(prev, currProp) ? prev[currProp] : undefined;
            }, header);
        }
        return value;
    }

    // static convertFromBoolToStringEquivalent(boolValue: boolean) {
    //     let result = '';
    //     const isBoolValueDefined = this.isDefined(boolValue);
    //     if (isBoolValueDefined) {
    //         result = boolValue ? BoolEquivalentString.TRUE : BoolEquivalentString.FALSE;
    //     }
    //     return result;
    // }

    static removeTimeFromDatesInObjectProperties(body: any) {
        if (this.isDefinedAndNotEmptyOrWhiteSpace(body)) {
            this.loopOverProps(body, (prop) => {
                if (this.dateParser(null, body[prop]) instanceof Date) {
                    body[prop] = this.removeTimeFromDate(body[prop]);
                }
            });
        }
    }

    static getParamFromRouteParents(route: ActivatedRouteSnapshot, paramName: string): any {
        let result = null;
        while (!this.isDefined(result = route.params[paramName]) && this.isDefined(route.parent)) {
            route = route.parent;
        }
        return result;
    }

    static getParamFromRouteChildren(route: ActivatedRouteSnapshot, paramName: string): any {
        let result = null;
        while (!this.isDefined(result = route.params[paramName]) && this.isDefined(route.firstChild)) {
            route = route.firstChild;
        }
        return result;
    }

    static exportToFile(data: any, fileName: string, fileType?: string) {
        let text = atob(data.body);
        let file = new Blob([text], { type: (fileType || 'text/csv') });
        var fileURL = URL.createObjectURL(file);
        //Uglier hack to download the file as CSV. Stupid JS.
        let a = document.createElement('a');
        a.href = fileURL;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    static openPdf(data: any, fileName: string) {
        let pdfWindow = window.open("", "_blank");
        pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.body) + "'></iframe>");
        pdfWindow.document.title = fileName;
    }

    //The following functions are to be used with the new microservices backend framework 
    
    //used as the opposite of Object.entries - adds [[key1, value1], [key2, value2]] pairs into an object of {key1: value1, key2: value2}
    static objectify = a => a.reduce( (o,[k,v]) => (o[k]=v,o), {} ); //https://stackoverflow.com/questions/26454655/convert-javascript-array-of-2-element-arrays-into-object-key-value-pairs

    static convertToMicroservicesObject(form: object) {
        Object.entries(form).map((entry) => {
            if (entry[1]) {
                if(Array.isArray(entry[1]) && entry[1][0] && typeof entry[1][0] == 'object') {
                    //multiselects
                    if (entry[1].length == 0) {
                        form[entry[0]] = [];
                    } else if (entry[1][0].REF) {
                        form[entry[0]] = entry[1].map(x => {
                            return { ref: x.REF }
                        })
                    } else {
                        //formarrays
                        let formarray = [];
                        Object.entries(entry[1]).map(main => {
                            let obj = Object.entries(main[1]).map(val => {
                                if((val[1] as any)?.REF) {
                                    val[1] = {ref: (val[1] as any).REF};
                                }
                                return val;
                            })
                            formarray.push(this.objectify(obj));
                        })
                        form[entry[0]] = formarray;
                    }
                } else if (typeof entry[1] == 'object') {
                    if (typeof entry[1].getMonth === 'function'){ 
                        //dates
                        let d = new Date(entry[1]);
                        form[entry[0]] = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
                    } else {
                        //single selects
                        if (form[entry[0]].REF) {
                            form[entry[0]] = { ref: entry[1].REF}
                        }
                    }
                }
                //numbers, booleans
            }
        });
    }

    static convertFromMicroservicesObject(details: object, form: FormGroup, dateFields?: string[]) {
        Object.entries(details).map((entry) => {
            let name = entry[0];
            let controls = form.controls[name];
            let val = details[name];
            if (controls) {
                if (typeof val == 'string') {
                    if (dateFields?.find(dateField => dateField == name)) {
                        const ds = val.split('/');
                        const switchedDate = `${ds[1]}/${ds[0]}/${ds[2]}`;
                        val = new Date(switchedDate);
                    }
                }
                controls.patchValue(val);
                return;
            }
        });
    }
}
