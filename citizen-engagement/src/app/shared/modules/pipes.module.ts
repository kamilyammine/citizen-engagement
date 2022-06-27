import { NgModule } from '@angular/core';
import { FilterPipePipe } from '../pipes/filter-pipe.pipe';


@NgModule({
    declarations: [
        FilterPipePipe,
    ],
    exports: [
        FilterPipePipe,
    ]
})
export class PipesModule { }
