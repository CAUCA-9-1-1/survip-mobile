import {Component, Input, OnChanges} from '@angular/core';
import {InspectionBuildingParticularRiskPictureRepositoryProvider} from '../../providers/repositories/inspection-building-particular-risk-picture-repository-provider.service';
import {InspectionBuildingParticularRiskRepositoryProvider} from '../../providers/repositories/inspection-building-particular-risk-repository-provider.service';
import {InspectionBuildingParticularRisk} from '../../models/inspection-building-particular-risk';
import {LoadingController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';
import {StaticListRepositoryProvider} from '../../providers/static-list-repository/static-list-repository';

@Component({
    selector: 'inspection-building-particular-risk-detail',
    templateUrl: 'inspection-building-particular-risk-detail.html'
})
export class InspectionBuildingParticularRiskDetailComponent implements OnChanges {

    private subscription: ISubscription;
    public currentRiskType: string = null;
    public currentIdBuilding: string = null;
    public risk: InspectionBuildingParticularRisk;
    public form: FormGroup;
    public walls: string[] = [];
    public sectors: string[] = [];

    @Input() set idBuilding(value: string) {
        this.currentIdBuilding = value;
    }

    @Input() set riskType(value: string) {
        this.currentRiskType = value;
    }

    constructor(
        private staticRepo: StaticListRepositoryProvider,
        private fb: FormBuilder,
        private loadCtrl: LoadingController,
        private repo: InspectionBuildingParticularRiskRepositoryProvider,
        public picRepo: InspectionBuildingParticularRiskPictureRepositoryProvider) {

        this.walls = staticRepo.getWallList();
        this.sectors = staticRepo.getSectorList();
        this.createForm();
    }

    public async ngOnChanges() {
        if (this.currentRiskType != null && this.currentIdBuilding != null && this.risk == null) {
            let load = this.loadCtrl.create({'content': 'Patientez...'});
            await load.present();
            this.risk = await this.repo.get(this.currentRiskType, this.currentIdBuilding);
            this.setValuesAndStartListening();
            await load.dismiss();
        }
    }

    private createForm() {
        this.form = this.fb.group({
            id: [''],
            hasOpening: [false, [Validators.required]],
            isWeakened: [false, [Validators.required]],
            wall: ['', [Validators.maxLength(15)]],
            sector: ['', [Validators.maxLength(15)]],
            comments: ['', [Validators.maxLength(500)]],
            dimension: ['', [Validators.maxLength(500)]],
        });
    }

    private setValuesAndStartListening(): void {
        this.setValues();
        this.startWatchingForm();
    }

    private setValues() {
        if (this.risk != null) {
            this.form.patchValue(this.risk);
        }
    }

    private startWatchingForm() {
        this.subscription = this.form.valueChanges
            .debounceTime(500)
            .subscribe(() => this.saveIfValid());
    }

    private saveIfValid() {
        if (this.form.valid && this.form.dirty)
            this.saveForm();
    }

    private async saveForm() {
        const formModel = this.form.value;
        Object.assign(this.risk, formModel);
        await this.repo.save(this.currentRiskType, this.risk)
            .then(()=>{
                this.form.markAsPristine();
            });

    }

    public getAllErrors(form: FormGroup): { [key: string]: any; } | null {
        let hasError = false;
        const result = Object.keys(form.controls).reduce((acc, key) => {
            const control = form.get(key);
            const errors = (control instanceof FormGroup)
                ? this.getAllErrors(control)
                : control.errors;
            if (errors) {
                acc[key] = errors;
                hasError = true;
            }
            return acc;
        }, {} as { [key: string]: any; });
        return hasError ? result : null;
    }
}
