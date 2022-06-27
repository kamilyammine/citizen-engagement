import { NgModule } from '@angular/core';
import { DropdownInputComponent } from '../components/dropdown-input/dropdown-input.component';
import { ErrorDisplayComponent } from '../components/error-display/error-display.component';
import { SubmitButtonComponent } from '../components/submit-button/submit-button.component';
import { TextInputComponent } from '../components/text-input/text-input.component';
import { TextAreaInputComponent } from '../components/textarea-input/textarea-input.component';
import { PipesModule } from './pipes.module';
import { ThirdPartiesModule } from './third-parties.module';


@NgModule({
    imports: [
        ThirdPartiesModule,
        PipesModule
    ],
    declarations: [
        TextInputComponent,
        ErrorDisplayComponent,
        SubmitButtonComponent,
        DropdownInputComponent,
        TextAreaInputComponent

    ],
    exports: [
        ThirdPartiesModule,
        TextInputComponent,
        ErrorDisplayComponent,
        SubmitButtonComponent,
        DropdownInputComponent,
        PipesModule,
        TextAreaInputComponent
    ]
})
export class ComponentsModule { }
