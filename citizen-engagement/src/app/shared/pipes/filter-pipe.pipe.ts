import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe'
})
export class FilterPipePipe implements PipeTransform {

  transform(items: any[], paramName: string, filter: string): any {
    if (!items || !filter) {
        return items;
    }
    return items.filter(item => item[paramName].toLowerCase().includes(filter.toLowerCase()));
  }
}
