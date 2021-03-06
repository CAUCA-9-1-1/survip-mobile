import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { InspectionBuildingParticularRisk } from 'src/app/shared/models/inspection-building-particular-risk';

@Injectable({providedIn: 'root'})
export class InspectionBuildingParticularRiskRepositoryProvider {

  constructor(private storage: OfflineStorage) {
  }

  public async get(riskType: string, idBuilding: string): Promise<InspectionBuildingParticularRisk> {
    const key = 'building_particular_risk_' + riskType + '_' + idBuilding;
    return await this.storage.get(key);
  }

  public save(riskType: string, risk: InspectionBuildingParticularRisk): Promise<any> {
    risk.isActive = true;
    risk.hasBeenModified = true;
    return this.storage.set('building_particular_risk_' + riskType + '_' + risk.idBuilding, risk);
  }

  public delete(riskType: string, risk: InspectionBuildingParticularRisk): Promise<any> {
    risk.isActive = false;
    risk.hasBeenModified = true;
    return this.storage.set('building_particular_risk_' + riskType + '_' + risk.idBuilding, risk);
  }
}
