import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {RiskLevel} from "../../models/risk-level";
import {Storage as OfflineStorage} from '@ionic/storage';
import {ExpiringCache} from "../expiring-cache";

@Injectable()
export class RiskLevelRepositoryProvider {

    constructor(private storage: OfflineStorage) {
    }

    public getAll() : Promise<RiskLevel[]> {
        return this.storage.get('risk_level')
          .then((cache:ExpiringCache<RiskLevel[]>) => cache.data);
    }

    public async getById(idRiskLevel: string) : Promise<RiskLevel> {
        const risks = await this.getAll();
        return risks.filter(risk => risk.id === idRiskLevel)[0];
    }
}
