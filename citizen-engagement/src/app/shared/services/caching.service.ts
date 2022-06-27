import { Injectable } from '@angular/core';
import { CachingObjectModel } from '../models/caching-object.model';

@Injectable()
export class CachingService {
    private cachingObject: CachingObjectModel[] = [];

    constructor() { }

    public emptyCachingObject() {
        this.cachingObject = [];
    }

    public cacheItem(serviceEndpoint: string, object: any) {
        if (this.checkIfDataExistsInCache(serviceEndpoint)) {
            this.removeCachedItem(serviceEndpoint);
        }
        this.cachingObject.push({url: serviceEndpoint, data: object});
    }

    public checkIfDataExistsInCache(url: string): boolean {
        const data = this.cachingObject.find(obj => obj.url === url);
        return data ? true : false;
    }

    public getCachedObject(url: string): any {
        const data = this.cachingObject.find(obj => obj.url === url);
        return data.data;
    }

    public removeCachedItem(key: string) {
        this.cachingObject.forEach((obj, index) => {
            if (obj.url === key) {
                this.cachingObject.splice(index, 1);
            }
        });
    }

    public removeCachedItemsByRegularExpression(regEx: string) {
        const indices = [];
        this.cachingObject.forEach((obj, index) => {
            if (obj.url.match(regEx)) {
                indices.push(index);
            }
        });
        for (let i = indices.length - 1; i >= 0; i--) {
            this.cachingObject.splice(indices[i], 1);
        }
    }
}
