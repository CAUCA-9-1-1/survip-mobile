import { Pipe, PipeTransform } from '@angular/core';
import ol from "openlayers";

@Pipe({
  name: 'formatCoordinates',
})
export class FormatCoordinatesPipe implements PipeTransform {

  transform(value: string) {
      console.log("Format coordinates : "+value);
      if(value) {
          if (value.startsWith('POINT')) {
              if (value) {
                  let formatCoords = new ol.format.WKT().readGeometry(value);
                  if (formatCoords) {
                      let long = parseFloat(formatCoords['A'][0]).toPrecision(8);
                      let lat = parseFloat(formatCoords['A'][1]).toPrecision(8);
                      return "[" + lat + ", " + long + "]";
                  }
              }
          }
      }
    return value;
  }
}
