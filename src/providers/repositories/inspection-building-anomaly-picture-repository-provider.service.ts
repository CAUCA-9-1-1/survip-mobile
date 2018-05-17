import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {InspectionBuildingAnomalyPicture} from '../../models/inspection-building-anomaly-picture';
import {map} from 'rxjs/operators';

@Injectable()
export class InspectionBuildingAnomalyPictureRepositoryProvider {

  constructor(public http: HttpService) {
  }

  public getList(idBuildingAnomaly: string): Promise<InspectionBuildingAnomalyPicture[]> {
    return this.http.get('inspection/building/anomaly/' + idBuildingAnomaly + '/picture')
      .pipe(map(response => response))
      .toPromise();
  }

  public save(picture: InspectionBuildingAnomalyPicture): Promise<any> {
    return this.http.post('inspection/building/anomaly/picture/', JSON.stringify(picture))
      .pipe(map(response => response))
      .toPromise();
  }

  public delete(idBuildingAnomalyPicture: string): Promise<any> {
    return this.http.delete('inspection/building/anomaly/picture/' + idBuildingAnomalyPicture)
      .pipe(map(response => response))
      .toPromise();
  }
}
