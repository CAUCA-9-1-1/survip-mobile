import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpService} from '../Base/http.service';
import {RiskLevel} from "../../models/risk-level";
import {Storage as OfflineStorage} from '@ionic/storage';

@Injectable()
export class RiskLevelRepositoryProvider {

    constructor(public http: HttpService, private storage: OfflineStorage) {
    }

    public getAll() : Promise<RiskLevel[]> {
        return this.storage.get('risk_level');
    }

    public async getById(idRiskLevel: string) : Promise<RiskLevel> {
        const risks = await this.getAll();
        return risks.filter(risk => risk.id === idRiskLevel)[0];
    }
}
