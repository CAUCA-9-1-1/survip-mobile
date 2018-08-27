import {EventEmitter, Injectable} from '@angular/core';
import {InspectionConfiguration} from '../../models/inspection-configuration';
import {HttpService} from '../Base/http.service';

@Injectable()
export class InspectionConfigurationProvider {

  public configuration: InspectionConfiguration;
  public menuRefreshed : EventEmitter<any> = new EventEmitter<any>();


  constructor(public http: HttpService) {
  }

  public async loadConfiguration(idInspection: string){
    this.configuration = await this.http
      .get('inspection/' + idInspection + '/configuration')
      .toPromise<InspectionConfiguration>();
  }
  
  public disableMenu(){
      this.configuration.hasGeneralInformation = false;
      this.configuration.hasImplantationPlan = false;
      this.configuration.hasCourse = false;
      this.configuration.hasWaterSupply = false;
      this.configuration.hasBuildingDetails = false;
      this.configuration.hasBuildingContacts = false;
      this.configuration.hasBuildingPnaps = false;
      this.configuration.hasBuildingFireProtection = false;
      this.configuration.hasBuildingHazardousMaterials = false;
      this.configuration.hasBuildingParticularRisks = false;
      this.configuration.hasBuildingAnomalies = false;
      this.menuRefreshed.emit(null);
  }
}
