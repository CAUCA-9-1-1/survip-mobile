import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCoordinates',
})
export class FormatCoordinatesPipe implements PipeTransform {

    transform(value: string) {
        if (value && value.startsWith('POINT (') && value.endsWith(')')) {
            const substring = value.substr(7, value.length - 8);
            const values = substring.split(' ');
            return "[" + values[1] + ", " + values[0] + "]";
        }
        return value;
    }
}
