import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCoordinates'
})
export class FormatCoordinatesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
