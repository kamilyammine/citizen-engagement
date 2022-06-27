import { HttpHeaders, HttpParams } from '@angular/common/http';

export class HttpRequestOptions {
    constructor(
        public headers?: HttpHeaders,
        public observe?: any,
        public params?: HttpParams | {
            [param: string]: string | string[],
        } | any,
        public body?: any,
        public reportProgress?: boolean,
        public responseType?: any,
        public withCredentials?: boolean,
    ) {
    }
}
