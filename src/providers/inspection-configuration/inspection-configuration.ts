import { Injectable } from '@angular/core';
import {InspectionConfiguration} from '../../models/inspection-configuration';
import {HttpService} from '../Base/http.service';

@Injectable()
export class InspectionConfigurationProvider {

  public configuration: InspectionConfiguration;

  constructor(public http: HttpService) {
  }

  public async loadConfiguration(idInspection: string){
    this.configuration = await this.http
      .get('inspection/' + idInspection + '/configuration')
      .toPromise<InspectionConfiguration>();
  }
}
