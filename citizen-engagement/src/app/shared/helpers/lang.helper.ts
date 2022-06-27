import { FormGroup } from '@angular/forms';
export class LanguageHelper {
    /** Generic Helpers */
    static isDefined(entity: any): boolean {
        return entity !== undefined && entity !== null;
    }
    static isNotDefined(entity: any): boolean {
        return !this.isDefined(entity);
    }
    static areDefined(entities: any[]): boolean {
        return this.reduceArray(
            entities,
            (cumulativeCondition, currEntity, currentIndex, array) => cumulativeCondition && this.isDefined(currEntity),
            true
        );
    }
    static isConstructorName(entity: any, constructorName: string): boolean {
        return this.isDefined(entity) &&
            entity.constructor.toString().indexOf(constructorName) > -1;
    }
    static stringify(entity: any, replacer?: (key: string, value: any) => any, space?: string | number): string {
        return JSON.stringify(entity, replacer, space);
    }
    static parse(entity: any, reviver?: (key: any, value: any) => any) {
        return JSON.parse(entity, reviver);
    }
    static JSONDeepClone(entity: any) {
        return this.parse(this.stringify(entity));
    }
    static deepClone(obj: any) {
        if (obj == null || typeof (obj) !== 'object' || obj instanceof FormGroup) {
            return obj;
        }

        const temp = new obj.constructor();

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = this.deepClone(obj[key]);
            }
        }

        return temp;
    }
    static objectAssign(entities: any, targetEntity = {}): any {
        return Object.assign(targetEntity, ...entities);
    }
    static sortAsc(entities: any[]) {
        const isArray = this.isArray(entities);
        let sortedArray = [];
        if (isArray) {
            sortedArray = entities.sort(this.ascSortingFn);
        }
        return sortedArray;
    }
    static sortDesc(entities: any[]) {
        const isArray = this.isArray(entities);
        let sortedArray = [];
        if (isArray) {
            sortedArray = entities.sort(this.descSortingFn);
        }
        return sortedArray;
    }
    static descSortingFn(a, b) {
        if (a > b) {
            return 0;
        } else if (a === b) {
            return 0;
        } else {
            return 1;
        }
    }
    static ascSortingFn(a, b) {
        if (a > b) {
            return 1;
        } else if (a === b) {
            return 0;
        } else {
            return 0;
        }
    }
    static scrollTo(options?: ScrollToOptions) {
        window.scrollTo(options);
    }
    static getBase64Prefix(base64: string) {
        const base64Defined = this.isDefined(base64) && this.isString(base64);
        if (base64Defined) {
            const first5Chars = base64.substr(0, 5);
            // switch (first5Chars.toUpperCase()) {
            //     case 'IVBOR':
            //         return 'data:image/png;base64,';
            //     case '/9J/4':
            //     case '/9J/2':
            //         return 'data:image/jpg;base64,';
            //     case 'AAAAF':
            //         return 'data:audio/mp4;base64,';
            //     case 'JVBER':
            //         return 'data:application/pdf;base64,';
            //     case 'AAABA':
            //         return 'ico';
            //     case 'UMFYI':
            //         return 'rar';
            //     case 'E1XYD':
            //         return 'rtf';
            //     case 'U1PKC':
            //         return 'data:text/plain;base64,';
            //     case 'MQOWM':
            //     case '77U/M':
            //         return 'srt';
            //     default:
            //         return '';
            // }
            return 'data:image/jpg;base64,';
        }
    }

    /** Object Helpers */
    /**
     * We remove properties from source object that are not included in target object
     * We add properties that are in target object but not in source object (keeping their original value)
     * @param source is the object that will be converted to the target object
     * @param target is the object that we are converting to
     */
    static convertFromSourceToTarget(source: PropVal, target: PropVal) {
        const sourceClone = this.JSONDeepClone(source);
        const targetClone = this.JSONDeepClone(target);
        const isSourceDefined = this.isDefined(sourceClone);
        const isTargetDefined = this.isDefined(targetClone);
        if (isSourceDefined && isTargetDefined) {
            this.loopOverProps(
                sourceClone,
                (prop) => {
                    const propExistInTarget = this.isPropPartOfThisObj(targetClone, prop);
                    if (!propExistInTarget) {
                        delete sourceClone[prop];
                    }
                }
            );
            this.loopOverProps(
                targetClone,
                (prop) => {
                    targetClone[prop] = this.isArray(targetClone[prop]) ?
                        ((<any[]>targetClone[prop]).shift() || null) :
                        targetClone[prop];
                }
            );
        }
        return Object.assign({}, targetClone, sourceClone);
    }
    static objHasProps(obj: PropVal): boolean {
        const isObj = this.isObj(obj);
        return isObj ? this.getObjNbrOfKeys(obj) > 0 : false;
    }
    static getObjNbrOfKeys(obj: PropVal): number {
        const isObj = this.isObj(obj);
        return isObj ? Object.keys(obj).length : 0;
    }
    static isPropDefined(obj: PropVal, dotSeperatedProps: string): boolean {
        return this.reduceProps(
            obj,
            dotSeperatedProps,
            (prev, currProp) => this.isPropPartOfThisObj(prev, currProp)
        );
    }
    static isObjAndPropDefined(obj: PropVal, prop: string) {
        const isObjDefined = this.isDefined(obj) && this.isObj(obj);
        const isPropDefined = this.isDefinedAndNotEmptyOrWhiteSpace(prop);
        return isObjDefined && isPropDefined;
    }
    static getPropValueIfObjIsDefined(obj: any, prop: any) {
        return this.isObjAndPropDefined(obj, prop) ? obj[prop] : undefined;
    }
    static isObj(entity: any): boolean {
        return this.isConstructorName(entity, 'Object') || (!this.isArray(entity) && typeof entity === 'object');
    }
    static createNewObject(): {} {
        return {};
    }
    static getObjProps(obj: PropVal) {
        const isObjDefined = this.isDefined(obj);
        if (isObjDefined) {
            return Object.keys(obj);
        }
        return [];
    }
    static setPropsValue(obj: any, propsVal: PropVal) {
        const isObjDefined = this.isDefined(obj);
        const isPropsValsDefined = this.isDefined(propsVal);
        obj = isObjDefined ? obj : this.createNewObject();
        if (isPropsValsDefined) {
            const props = this.getObjProps(propsVal);
            props.forEach(prop => this.setPropValueIfObjIsDefined(obj, prop, propsVal[prop]));
        }
        return obj;
    }
    static setPropValueIfObjIsDefined(obj: any, prop: string, value: any) {
        if (this.isObjAndPropDefined(obj, prop)) {
            obj[prop] = value;
        }
        return obj;
    }
    static isPropPartOfThisObj(obj: PropVal, prop: string): boolean {
        return this.isObjAndPropDefined(obj, prop) ? prop in obj : false;
    }
    static getPropValue<T = any>(obj: PropVal, dotSeperatedProps: string): T {
        return this.reduceProps(
            obj,
            dotSeperatedProps,
            (cumulativeObject, currProp) => this.isPropPartOfThisObj(cumulativeObject, currProp) ? cumulativeObject[currProp] : undefined
        );
    }
    static deleteUndefinedProps(obj: PropVal) {
        const isObjDefined = this.isDefined(obj);
        if (isObjDefined) {
            this.loopOverProps(obj, (prop) => {
                const isPropValDefined = this.isDefined(obj[prop]);
                if (!isPropValDefined) {
                    delete obj[prop];
                }
            });
        }
        return obj;
    }
    static loopOverProps(obj: PropVal, action) {
        const isObjDefined = this.isDefined(obj);
        if (isObjDefined) {
            const props = this.getObjProps(obj);
            props.forEach(prop => action(prop));
        }
    }
    static reduceProps(obj: PropVal, dotSeperatedProps: string, condition: any, initialValue?: any): any {
        let value;
        if (
            this.isObjAndPropDefined(obj, dotSeperatedProps) &&
            this.isDefined(condition)
        ) {
            const props = dotSeperatedProps.split('.');
            value = props.reduce(
                (prev, currProp) => condition(prev, currProp),
                this.isDefined(initialValue) ? initialValue : obj
            );
        }
        return value;
    }
    static getFirstPropVal(obj: PropVal) {
        const isObjDefined = this.isDefined(obj);
        if (isObjDefined) {
            const props = this.getObjProps(obj);
            return obj[props[0]];
        }
        return obj;
    }


    /** Array Helpers */
    static isArray(entity: any): boolean {
        return this.isConstructorName(entity, 'Array');
    }
    static mapArray(array: any[], action) {
        const isArrayDefined = this.isDefined(array);
        if (isArrayDefined) {
            array = array.map(item => action(item));
        }
        return array;
    }
    static reduceArray<ArrayType, InitialValueType>(
        array: ArrayType[],
        condition: (prev: InitialValueType, item: ArrayType, currentIndex, arrayOfItems) => any,
        initialValue: InitialValueType
    ): any {
        let value = array;
        if (
            this.isDefined(array) &&
            this.isDefined(condition)
        ) {
            value = array.reduce(
                (prev, item, currentIndex, arrayOfItems) => condition(prev, item, currentIndex, arrayOfItems),
                initialValue
            );
        }
        return value;
    }
    static arrayCount(array: any[]) {
        return this.isArray(array) ? array.length : undefined;
    }
    static pushIf(item: any, array: any[], condition?: any) {
        const arrayDefined = this.isArray(array);
        const itemDefined = this.isDefined(item);
        const conditionDefined = this.isDefined(condition);
        if (arrayDefined && itemDefined) {
            if (conditionDefined) {
                if (condition) {
                    array.push(item);
                }
            } else {
                array.push(item);
            }
        }
        return array;
    }
    static arrayToObj(array: string[]) {
        const arrayDefined = this.isDefined(array);
        const arrayIsArray = this.isArray(array);
        const obj = {};
        if (arrayDefined && arrayIsArray) {
            array.forEach(item => obj[item] = undefined);
        }
        return obj;
    }

    static sortArrayByProperty(data: any[], prop: string, sortDirection:string, type: string)
    {
        data.sort((a, b) => {
            switch(type.toLowerCase()) {
                case 'date': 
                case 'datetime':
                    return new Date(a[prop]).getTime() - new Date(b[prop]).getTime();

                case 'amount':
                case 'decimal':
                    return a[prop] - b[prop];
                default: return new String(a[prop]).localeCompare(b[prop]); 
            }                        
        });

        if(sortDirection == 'desc') data.reverse();
        return data;
    }

    /** Number Helpers */
    static isDefinedAndPositive(entity: any): boolean {
        return this.isDefined(entity) && this.isPositive(entity);
    }
    static isPositive(entity: number) {
        return entity > 0;
    }
    static isNumber(entity: any): boolean {
        return this.isConstructorName(entity, 'Number');
    }
    static minNbr(...nbrs: number[]) {
        const ascArray = this.sortAsc(nbrs);
        return ascArray[0];
    }
    static maxNbr(...nbrs: number[]) {
        const descArray = this.sortDesc(nbrs);
        return descArray[0];
    }
    static sliceArray(array: any[], startIndex: number, lastIndex: number) {
        const arrayDefined = this.isDefined(array);
        if (arrayDefined) {
            return array.slice(startIndex, lastIndex);
        }
        return [];
    }


    /** String Helpers */
    static isEmptyString(entity: any): boolean {
        return entity === '';
    }
    static isWhiteSpace(entity: any): boolean {
        return LanguageHelper.isString(entity) && entity.length > 0 && entity.trim().length === 0;
    }
    static isDefinedAndNotEmptyOrWhiteSpace(entity: any): boolean {
        return this.isDefined(entity) && !LanguageHelper.isEmptyString(entity) && !LanguageHelper.isWhiteSpace(entity);
    }
    static isString(entity: any): boolean {
        return this.isConstructorName(entity, 'String');
    }
    static removeFromEndOfString(str: string, nbrOfChars: number) {
        const isStringDefined = this.isDefinedAndNotEmptyOrWhiteSpace(str);
        if (isStringDefined) {
            const nbOfCharsInStr = str.length;
            const allowedNbrOfCharsToBeTruncated = this.minNbr(nbrOfChars, nbOfCharsInStr);
            str = str.slice(0, nbOfCharsInStr - allowedNbrOfCharsToBeTruncated);
        }
        return str;
    }
    static appendStringIfDefined(baseStr: string, strToAppend: string) {
        const isBaseStrString = this.isString(baseStr);
        const isStrToAppendString = this.isString(strToAppend);
        if (isBaseStrString && isStrToAppendString) {
            return `${baseStr}${strToAppend}`;
        }
        return baseStr;
    }
    static separateByComma(...entities: any[]): string {
        let result = '';
        const isEntitiesDefined = this.isDefined(entities);
        if (isEntitiesDefined) {
            result = this.reduceArray(
                entities,
                (commaSeparated, entity, currentIndex, array) => {
                    return this.appendComma(
                        `${commaSeparated}${entity}`,
                        currentIndex,
                        this.arrayCount(array)
                    );
                },
                result
            );
        }
        return result;
    }
    static appendComma(str: string, currentIndex?: number, totalCount?: number) {
        const isCurrentIndexDefined = this.isDefined(currentIndex);
        const isTotalCountDefined = this.isDefined(totalCount);
        let isLastString = false;
        if (isCurrentIndexDefined && isTotalCountDefined) {
            isLastString = totalCount - currentIndex === 1;
        }
        return isLastString ? `${str}` : `${str},`;
    }
    static toLowerCase(entity: any) {
        const isEntityAString = this.isString(entity);
        return isEntityAString ? entity.toLowerCase() : entity;
    }
    static strLength(str: string) {
        const strDefined = this.isDefined(str) && this.isString(str);
        return strDefined ? str.length : 0;
    }
    static appendCharBefore(str: string, char: string, beforeStr: string) {
        const strDefined = this.isDefined(str) && this.isString(str);
        const charDefined = this.isDefined(char) && this.isString(char);
        const beforeStrDefined = this.isDefined(beforeStr) && this.isString(beforeStr);
        if (strDefined && charDefined && beforeStrDefined) {
            return str.replace(beforeStr, `${char}${beforeStr}`);
        }
        return str;
    }
    static capitalize(...strings: string[]) {
        const stringsDefined = this.isDefined(strings);
        if (stringsDefined) {
            return strings.map(str => {
                const strDefined = this.isDefined(str) && this.isString(str) && this.strLength(str) > 0;
                return strDefined ? `${str[0].toUpperCase()}${str.slice(1)}` : str;
            });
        }
    }

    /** Date Helpers */
    static isDate(entity: any): boolean {
        return this.isConstructorName(entity, 'Date') || this.isConstructorName(new Date(entity), 'Date');
    }

    static dateParser(key, value) {
        const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:Z|(\+|-)([\d|:]*))?$/;
        const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

        if (typeof value === 'string') {
            let a = reISO.exec(value);
            if (a) {
                return new Date(value);
            }
            a = reMsAjax.exec(value);
            if (a) {
                const b = a[1].split(/[-+,.]/);
                return new Date(b[0] ? +b[0] : 0 - +b[1]);
            }
        }
        return value;
    }

    /** Boolean Helpers */
    static isBoolean(entity: any): boolean {
        return this.isConstructorName(entity, 'Boolean');
    }

    static removeTimeFromDate(value: string) : string {
        let date = new Date(value);
        value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        return value;
    }

    static removeOffsetFromDate(value: string): string {
        let date = new Date(value);
        value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return value;
    }
    static toEnglishDigits(str) {
        if (this.isDefinedAndNotEmptyOrWhiteSpace(str)) {
            str = str.toString();
            // convert persian digits [۰۱۲۳۴۵۶۷۸۹]
            var e = '۰'.charCodeAt(0);
            str = str.replace(/[۰-۹]/g, function(t) {
                return t.charCodeAt(0) - e;
            });
            // convert arabic indic digits [٠١٢٣٤٥٦٧٨٩]
            e = '٠'.charCodeAt(0);
            str = str.replace(/[٠-٩]/g, function(t) {
                return t.charCodeAt(0) - e;
            });
            return str;
        } else {
            return undefined;
        }
    }

    static convertArabicNumber(val) : number {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    // 0 is at index 0 and 9 at index 9
    let str = val.toString();
    for (var i = 0; i < 10; i++) {
    str = str.replace(arabicNumbers[i], `${i}`);
    }
    return str;
    }

    static isZero(val) : boolean {
        let str = +this.toEnglishDigits(val);
        return (str == 0)
    }

    static convertDateToImpactDate(date: Date) {
        const formattedMonth = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)));
        const formattedDay = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
        const formattedYear = date.getFullYear();
        const formattedDate =  formattedDay  + '/' + formattedMonth + '/' + formattedYear;
        return formattedDate;
    }

    //returns true if the date (without time) is in the past
    static hasDatePassed(date: Date){
        let now = new Date();
        now.setHours(0,0,0,0);
        date.setHours(0,0,0,0);

        return date > now;
    }


    static AddIfDepricated(detailsForm, list, propName, level2PropName = null) {
        if (detailsForm) {
            if (detailsForm[propName]) {
                if (level2PropName) {
                    if (detailsForm[propName].length > 0) {
                        detailsForm[propName].forEach(element => {
                            const ind = list.findIndex(x => x.REF === element[level2PropName].REF);
                            if (ind < 0) {
                                list.push(element[level2PropName]);
                            }
                        });
                    }
                } else {
                    const ind = list.findIndex(x => x.REF === detailsForm[propName].REF);
                    if (ind < 0) {
                        list.push(detailsForm[propName]);
                    }
                }
            }
        }
        return list;
    }
    
}

export interface PropVal {
    [prop: string]: any;
}

