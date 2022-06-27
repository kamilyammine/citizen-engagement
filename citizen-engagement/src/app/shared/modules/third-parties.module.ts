import { CommonModule } from '@angular/common';
import { NgModule, Provider } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './materials.module';

@NgModule({
    imports: [],
    exports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule,
        FormsModule
    ],
    providers: []
})
export class ThirdPartiesModule {
    static forServices(): Provider[] {
        return [
            MaterialModule.forServices()
        ];
    }
}
