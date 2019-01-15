import {EventEmitter, Injectable} from '@angular/core';
import {InspectionConfiguration} from '../../models/inspection-configuration';
import {HttpService} from '../Base/http.service';

@Injectable()
export class InspectionConfigurationProvider {

  private initialConfiguration: InspectionConfiguration;
  public configuration: InspectionConfiguration;
  public menuRefreshed : EventEmitter<any> = new EventEmitter<any>();

  constructor(public http: HttpService) {
  }

  public async setConfiguration(configuration: InspectionConfiguration){
    console.log('Configuration set', configuration);
    this.initialConfiguration = configuration;
    this.configuration = Object.assign(new InspectionConfiguration(),this.initialConfiguration);
    this.menuRefreshed.emit(null);
  }

  public disableMenu(){

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
      this.configuration.hasSurvey = false;
      this.menuRefreshed.emit(null);
  }

  public activateMenu(){
      this.configuration = this.initialConfiguration;
      this.menuRefreshed.emit(null);
  }
}
