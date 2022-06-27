import { HttpRequestOptions } from '../models/http-request-options.model';
import { defaultHTTPRequestOptionsConfig } from '../config/http-requests-header.config';
import { environment } from 'src/environments/environment';
import { LanguageHelper } from '../helpers/lang.helper';
import { SettingsService } from '../services/settings.service';
import { Injector } from '@angular/core';

export abstract class HttpManagerClass {

    langHelper = LanguageHelper;
    protected settingsService: SettingsService;

    constructor(protected injector: Injector) {
        this.settingsService = this.injector.get(SettingsService);
    }

    protected getRequestUrl(host: string, microservices: string, method: string) {
        const baseUrl = host ? host : this.settingsService.settings.baseUrl;
        return `${baseUrl}/${microservices}/${method}`;
    }

    protected overwriteDefaultOptions(options: HttpRequestOptions, showLoader = true, body?: any): HttpRequestOptions {
        options = this.makeSureOptionsAreDefined(options);
        options = this.makeSureHeadersAreDefined(options);
        options = this.setShowLoaderHeader(options, showLoader);
        options = this.setRequestBody(options, body);

        return Object.assign(
            {},
            defaultHTTPRequestOptionsConfig,
            options
        );
    }

    protected setAndGetParams(obj: any) {
        return {
            params: obj
        };
    }

    protected getRequestUrlWithParam(host: string, microservice: string, method: string, obj: any) {
        let params: string[] = [];
        if (obj) {
            Object.keys(obj).forEach(k => {
                if (this.langHelper.isArray(obj[k]) && obj[k].length > 0) {
                    obj[k].forEach(v => {
                        params.push(`${k}=${v}`);
                    });
                } else if (this.langHelper.isDefined(obj[k])) {
                    params.push(`${k}=${obj[k]}`);
                }
            });
        }
        const baseUrl = host ? host : this.settingsService.settings.baseUrl;
        let link = params.length > 0 ? `${baseUrl}/${microservice}/${method}?${params.join('&')}` : `${baseUrl}/${method}`;
        return link;
    }

    private makeSureOptionsAreDefined(options: HttpRequestOptions): HttpRequestOptions {
        if (options && !options.observe) { options.observe = 'response'; }
        return options ? options : defaultHTTPRequestOptionsConfig;
    }

    private makeSureHeadersAreDefined(options: HttpRequestOptions): HttpRequestOptions {
        const headersDefined = options.headers ? options.headers : undefined;
        if (!headersDefined) {
            options.headers = defaultHTTPRequestOptionsConfig.headers;
        }
        return options;
    }

    private setShowLoaderHeader(options: HttpRequestOptions, showLoader = true): HttpRequestOptions {
        options.headers = options.headers.set('showLoader', `${showLoader}`);
        return options;
    }

    private setRequestBody(options: HttpRequestOptions, body?: any): HttpRequestOptions {
        options.body = body;
        return options;
    }

    GetFormDataFromObject(object: any): FormData {

        const formData: FormData = new FormData();

        Object.keys(object).forEach(prop => {
            if (object[prop] != null) {

                var objProp = object[prop];

                if (this.dateParser(null, objProp) instanceof Date) {
                    objProp = this.dateParser(null, objProp).toISOString();
                }

                formData.append(`${prop}`, objProp);
            }
        });

        return formData;
    }

    dateParser(key, value) {
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

    protected setAndGetFormData(obj: any) {
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(param => {
            if (obj[param]) {
                if (this.langHelper.isArray(obj[param]) && obj[param].length > 0) {
                    obj[param].forEach(v => {
                        formData.append(param, v);
                    });
                }
                else {
                    formData.append(param, obj[param]);
                }
            }
        });
        return formData;
    }
}
