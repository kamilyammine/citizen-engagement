import { NgModule, Provider } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { ThirdPartiesModule } from './third-parties.module';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SpinnerService } from '../services/spinner.service';
import { SnackbarService } from '../services/snackbar.service';
import { SettingsService } from '../services/settings.service';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', `.json?v=${new Date().getTime()}`);
}


@NgModule({})
export class ServicesModule {
  static forShared(): Provider[] {
    return [
      ThirdPartiesModule.forServices(),
      LocalStorageService,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }).providers,
      TranslateService,
      SpinnerService,
      SnackbarService,
      SettingsService
    ];
  }
}
