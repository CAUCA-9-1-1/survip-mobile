import {EventEmitter, Injectable} from '@angular/core';
import { InspectionConfiguration } from 'src/app/shared/models/inspection-configuration';
import { HttpService } from '../../base/http.service';

@Injectable({providedIn: 'root'})
export class InspectionConfigurationProvider {

  private initialConfiguration: InspectionConfiguration;
  public configuration: InspectionConfiguration;
  public menuRefreshed: EventEmitter<any> = new EventEmitter<any>();

  constructor(public http: HttpService) {
  }

  public async setConfiguration(configuration: InspectionConfiguration) {
    this.initialConfiguration = configuration;
    this.configuration = Object.assign(new InspectionConfiguration(), this.initialConfiguration);
    this.menuRefreshed.emit(null);
  }

  public disableMenu() {

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

  public activateMenu() {
      this.configuration = this.initialConfiguration;
      this.menuRefreshed.emit(null);
  }
}
