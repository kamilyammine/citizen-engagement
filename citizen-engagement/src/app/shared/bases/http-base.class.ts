import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpManagerClass } from './http-manager.class';
import { Injector } from '@angular/core';
import { defaultHTTPRequestOptionsConfig } from '../config/http-requests-header.config';
import { CachingService } from '../services/caching.service';
import { tap } from 'rxjs/operators';
import { MicroservicesEnum } from '../models/microservices.enum';

export abstract class HttpBaseClass extends HttpManagerClass {
    private cachingService: CachingService;

    constructor(protected http: HttpClient,
        protected injector: Injector) {
        super(injector);
        this.cachingService = this.injector.get(CachingService);
    }

    get<T>(method: string, options = defaultHTTPRequestOptionsConfig, showLoader = true, microservice = MicroservicesEnum.FEEDBACK, host = this.settingsService.settings.baseUrl, shouldCacheData = false, forceFetchData = false): Observable<any> {
        if (navigator.onLine) {
            if (this.cachingService.checkIfDataExistsInCache(this.getRequestUrlWithParam(host, microservice, method, options?.params)) && !forceFetchData) {
                return of(this.cachingService.getCachedObject(this.getRequestUrlWithParam(host, microservice, method, options?.params)));
            } else {
                return this.http.get<HttpResponse<T>>(this.getRequestUrl(host, microservice, method), this.overwriteDefaultOptions(options, showLoader)).pipe(tap(data => {
                    if (shouldCacheData) {
                        this.cachingService.cacheItem(this.getRequestUrlWithParam(host, microservice, method, options?.params), data);
                    }
                }));
            }
        }
    }

    post<T>(method: string,
        body?: any,
        options = defaultHTTPRequestOptionsConfig,
        showLoader = true,
        microservice = MicroservicesEnum.FEEDBACK,
        host = this.settingsService.settings.baseUrl): Observable<any> {
        if (navigator.onLine) {
            return this.http.post<HttpResponse<T>>(
                this.getRequestUrl(host, microservice, method), body,
                this.overwriteDefaultOptions(options, showLoader)
            );
        }
    }

    put<T>(
        method: string,
        body?: any,
        options = defaultHTTPRequestOptionsConfig,
        showLoader = true,
        microservice = MicroservicesEnum.FEEDBACK,
        host = this.settingsService.settings.baseUrl
    ): Observable<any> {
        if (navigator.onLine) {
            return this.http.put<HttpResponse<T>>(this.getRequestUrl(host, microservice, method), body, this.overwriteDefaultOptions(options, showLoader));
        }
    }

    delete<T>(
        method: string,
        body?: any,
        options = defaultHTTPRequestOptionsConfig,
        showLoader = true,
        microservice = MicroservicesEnum.FEEDBACK,
        host = this.settingsService.settings.baseUrl
    ): Observable<any> {
        if (navigator.onLine) {
            return this.http.delete<HttpResponse<T>>(
                this.getRequestUrl(host, microservice, method), this.overwriteDefaultOptions(options, showLoader, body));
        }
    }
}
