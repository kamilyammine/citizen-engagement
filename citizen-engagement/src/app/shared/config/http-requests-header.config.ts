import { HttpHeaders } from '@angular/common/http';
import { HttpRequestOptions } from '../models/http-request-options.model';

export const defaultHTTPRequestOptionsConfig = new HttpRequestOptions(
    // new HttpHeaders({ 'showLoader': 'true' }),
    new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }),
    'response'
);
