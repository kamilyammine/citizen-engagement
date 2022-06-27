import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Settings } from '../models/settings.model';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })	
export class SettingsHttpService {	
    constructor(private settingsService: SettingsService,	
                private httpClient: HttpClient) {	
    }	
    public initializeApp(): Promise<any> {
        return this.httpClient.get('assets/configs/settings.json').pipe(tap((settings: Settings) => {
            this.settingsService.settings = settings;
            Object.keys(this.settingsService.settings).forEach(l => {
                if(!this.settingsService.settings[l]){
                    this.settingsService.settings[l] = environment[l];
                }
            })
        })).toPromise();
    }
}