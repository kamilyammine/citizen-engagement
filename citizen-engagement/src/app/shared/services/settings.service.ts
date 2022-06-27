import { Injectable } from '@angular/core';
import { Settings } from '../models/settings.model';

@Injectable()
export class SettingsService {
    public settings: Settings;

    constructor() {
        this.settings = new Settings();
    }
}