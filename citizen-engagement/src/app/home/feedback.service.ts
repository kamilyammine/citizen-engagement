import { Location } from './feedback.config';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpBaseClass } from '../shared/bases/http-base.class';
import { HttpRequestOptions } from '../shared/models/http-request-options.model';

@Injectable()
export class FeedbackService extends HttpBaseClass {

  constructor(public http: HttpClient,
    public injector: Injector) {
    super(http, injector);
  }

  getKeys() {
    return this.get('lookup/items');
  }

  getProjects(location?: Location) {
    if (location) {
      let qparams = Object.assign({}, this.setAndGetParams(location).params);
      return this.get(`project/closest?page=0&size=250`, this.setAndGetParams(qparams));
    }
    return this.get('project?page=0&size=250');
  }

  getProjectById(id: number) {
    return this.get(`project/${id}`);
  }

  sendFeedback(obj: any) {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data', 'showLoader': 'true' }) as any;
    return this.post('feedback', obj, { headers: headers });
  }

  getKadaas() {
    return this.get('lookup/kadaa');
  }

  getFile(fileId: number) {
    const reqOptions = new HttpRequestOptions(
      undefined,
      undefined,
      undefined,
      'response',
      undefined,
      'blob'
    );
    return this.get(`file/${fileId}`, reqOptions, false)
  }
}
