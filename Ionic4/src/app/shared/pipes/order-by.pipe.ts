import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  /**
   * Takes an array and sort it by the field.
   */
  transform(list: any[], field: string): any[] {
    const sorted = list.sort((t1, t2) => t1[field].toString().localeCompare(t2[field].toString()));
    return sorted;
  }
}
