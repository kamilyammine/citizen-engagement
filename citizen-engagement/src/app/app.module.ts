import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { SettingsHttpService } from './shared/services/settings-http.service';

export function app_Init(settingsHttpService: SettingsHttpService) {
    return (): Promise<any> => settingsHttpService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [{ provide: APP_INITIALIZER, useFactory: app_Init, deps: [SettingsHttpService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
