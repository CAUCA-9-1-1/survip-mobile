import { Injectable } from '@angular/core';
import {HttpService} from '../Base/http.service';
import {map} from 'rxjs/operators';
import {InspectionBuildingHazardousMaterialForList} from '../../models/inspection-building-hazardous-material-for-list';
import {InspectionBuildingHazardousMaterial} from '../../models/inspection-building-hazardous-material';

@Injectable()
export class InspectionBuildingHazardousMaterialRepositoryProvider {

  constructor(public http: HttpService) {
  }

  public getList(idBuilding: string) : Promise<InspectionBuildingHazardousMaterialForList[]> {
    return this.http.get('inspection/building/' + idBuilding + '/hazardousmaterial')
      .pipe(map(response => response))
      .toPromise();
  }

  public get(idBuildingHazardousMaterial: string) : Promise<InspectionBuildingHazardousMaterial> {
    return this.http.get('inspection/building/hazardousmaterial/' + idBuildingHazardousMaterial)
      .pipe(map(response => response))
      .toPromise();
  }

  public save(contact: InspectionBuildingHazardousMaterial): Promise<any> {
    return this.http.post('inspection/building/hazardousmaterial/', JSON.stringify(contact))
      .pipe(map(response => response))
      .toPromise();
  }

  public delete(idBuildingHazardousMaterial: string) : Promise<any> {
    return this.http.delete('inspection/building/hazardousmaterial/' + idBuildingHazardousMaterial)
      .pipe(map(response => response))
      .toPromise();
  }
}
