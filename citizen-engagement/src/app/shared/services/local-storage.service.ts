import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
    clear() {
        localStorage.clear();
    }

    getItem(key: string) {
        return localStorage.getItem(key);
    }

    key(index: number) {
        return localStorage.key(index);
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

    setItem(key: string, data: string) {
        localStorage.setItem(key, data);
    }
}
