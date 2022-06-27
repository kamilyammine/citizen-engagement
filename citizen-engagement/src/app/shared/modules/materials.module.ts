import { NgModule, Provider } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
    exports: [
        MatSnackBarModule,
        MatToolbarModule,
        TextFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatSlideToggleModule
    ],
    providers: []
})
export class MaterialModule {
    static forServices(): Provider[] {
        return [];
    }
}
