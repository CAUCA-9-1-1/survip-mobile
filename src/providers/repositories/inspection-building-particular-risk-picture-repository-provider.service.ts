import {Injectable} from '@angular/core';
import {BuildingChildPictureRepositoryProvider} from '../../interfaces/building-child-picture-repository-provider';
import {HttpService} from '../Base/http.service';
import {InspectionBuildingChildPictureForWeb} from '../../models/inspection-building-child-picture-for-web';
import {map} from 'rxjs/operators';

@Injectable()
export class InspectionBuildingParticularRiskPictureRepositoryProvider implements BuildingChildPictureRepositoryProvider {

  constructor(public http: HttpService) {
  }

  public getList(idBuildingParticularRisk: string): Promise<InspectionBuildingChildPictureForWeb[]> {
    return this.http.get('inspection/building/particularrisk/' + idBuildingParticularRisk + '/picture')
      .pipe(map(response => response))
      .toPromise();
  }

  public save(picture: InspectionBuildingChildPictureForWeb): Promise<any> {
    return this.http.post('inspection/building/particularrisk/picture/', JSON.stringify(picture))
      .pipe(map(response => response))
      .toPromise();
  }

  public delete(idBuildingParticularRisk: string): Promise<any> {
    return this.http.delete('inspection/building/particularrisk/picture/' + idBuildingParticularRisk)
      .pipe(map(response => response))
      .toPromise();
  }
}
