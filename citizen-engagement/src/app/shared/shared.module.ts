import { ModuleWithProviders, NgModule } from '@angular/core';
import { ComponentsModule } from './modules/components.module';
import { ServicesModule } from './modules/services.module';
import { InterceptorsModule } from './modules/interceptors.module';
import { CachingService } from './services/caching.service';

@NgModule({
  declarations: [],
  imports: [ComponentsModule],
  exports: [ComponentsModule]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      providers: [
        ServicesModule.forShared(),
        InterceptorsModule.forShared(),
        CachingService,
      ]
    };
  }
}
