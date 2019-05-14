import { Pipe, PipeTransform } from '@angular/core';
//import ol from "openlayers";

@Pipe({
  name: 'formatCoordinates',
})
export class FormatCoordinatesPipe implements PipeTransform {

    transform(value: string) {
        if (value && value.startsWith('POINT (') && value.endsWith(')')) {
            const substring = value.substr(7, value.length - 2);
            console.log('oh my', substring);
            const values = substring.split(' ');
            console.log('oh my god', values);
            return "[" + values[1] + ", " + values[0] + "]";

            /*if (value) {
                let formatCoords = new ol.format.WKT().readGeometry(value);
                if (formatCoords) {
                    let long = parseFloat(formatCoords['A'][0]).toPrecision(8);
                    let lat = parseFloat(formatCoords['A'][1]).toPrecision(8);
                    return "[" + lat + ", " + long + "]";
                }
            }*/
        }
        return value;
    }
}
