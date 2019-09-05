import { Injectable } from '@angular/core';
import { Batch } from 'src/app/shared/models/batch';
import { InspectionRepositoryProvider } from '../../repositories/inspection-repository-provider.service';
import { Inspection } from 'src/app/shared/interfaces/inspection.interface';
import { RiskLevelRepositoryProvider } from '../../repositories/risk-level-repository';
import { RiskLevel } from 'src/app/shared/models/risk-level';
import { OfflineDataSynchronizerProvider } from '../offline-data-synchronizer/offline-data-synchronizer';

@Injectable({ providedIn: 'root' })
export class InspectionListControllerProvider {

    public searchTerm: string = '';

    public riskLevels: RiskLevel[] =  null;
    public batches: Batch[];
    public filteredBatches: Batch[];
    public dataIsCorrectlyLoaded: boolean = true;

    constructor(
        private synchronizer: OfflineDataSynchronizerProvider,
        private inspectionService: InspectionRepositoryProvider,
        private riskLevelService: RiskLevelRepositoryProvider) {
    }

    public async refreshInspectionList() {
        try {
            if (await this.synchronizer.synchronizeBaseEntities()) {
                if (this.riskLevels == null) {
                    await this.refreshRiskLevels();
                }
                this.batches = await this.inspectionService.getAll();
                this.synchronizer.synchronizingCities(this.getAllCityIds());
                this.filterList();
                this.dataIsCorrectlyLoaded = true;
            } else {
                this.dataIsCorrectlyLoaded = false;
            }
        } catch (err) {
            this.dataIsCorrectlyLoaded = false;
        }
    }

    private async refreshRiskLevels(): Promise<void> {
        this.riskLevels = await this.riskLevelService.getAll();
    }

    private getAllCityIds(): string[] {
        const cityIds = [];
        this.batches.forEach(batch => {
            batch.inspections.forEach(inspection => {
                if (cityIds.every(id => id !== inspection.idCity)) {
                    cityIds.push(inspection.idCity);
                }
            });
        });
        return cityIds;
    }

    public filterList() {
        if (this.searchTerm && this.searchTerm !== '') {
            this.applyFilter();
        } else {
            this.filteredBatches = this.batches;
        }
    }

    private applyFilter() {
        this.filteredBatches = JSON.parse(JSON.stringify(this.batches));
        this.filteredBatches.forEach((batch: Batch) => {
            batch.inspections = batch.inspections.filter(inspection => this.mustBeShown(inspection));
        });
        this.filteredBatches = this.filteredBatches.filter(batch => batch.inspections.length > 0);
    }

    private mustBeShown(inspection: Inspection): boolean {
        const riskLevelName = this.getRiskDescription(inspection.idRiskLevel);
        const riskContainsSearchTerm = riskLevelName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        const address = inspection.civicNumber + inspection.civicLetter + ', ' + inspection.laneName;
        const addressContainsSearchTerm = address.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        const batchDescriptionContainsSearchTerm = inspection.batchDescription.toLowerCase()
            .indexOf(this.searchTerm.toLowerCase()) > -1;
        return riskContainsSearchTerm || addressContainsSearchTerm || batchDescriptionContainsSearchTerm;
    }

    public getRiskDescription(idRiskLevel: string): string {
        const result = this.riskLevels.find(risk => risk.id === idRiskLevel);
        if (result != null) {
            return result.name;
        } else {
            return '';
        }
    }

    public getRiskColor(idRiskLevel: string): string {
        const result = this.riskLevels.find(risk => risk.id === idRiskLevel);
        if (result != null) {
            return result.color;
        } else {
            return 'black';
        }
    }
}
