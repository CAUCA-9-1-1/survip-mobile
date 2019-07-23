import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { InspectionBuildingParticularRisk } from 'src/app/shared/models/inspection-building-particular-risk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaticListRepositoryProvider } from 'src/app/core/services/repositories/static-list-repository/static-list-repository';
import { LoadingController } from '@ionic/angular';
import { InspectionBuildingParticularRiskRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-particular-risk-repository-provider.service';
import { InspectionBuildingParticularRiskPictureRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-particular-risk-picture-repository-provider.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-building-particular-risk-detail',
  templateUrl: './building-particular-risk-detail.component.html',
  styleUrls: ['./building-particular-risk-detail.component.scss'],
})
export class BuildingParticularRiskDetailComponent implements OnInit, OnChanges {

  public currentRiskType: string = null;
  public currentIdBuilding: string = null;
  public risk: InspectionBuildingParticularRisk;
  public form: FormGroup;
  public walls: string[] = [];
  public sectors: string[] = [];
  public wall: string;

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

    this.walls = this.staticRepo.getWallList();
    this.sectors = this.staticRepo.getSectorList();
    this.createForm();
  }

  ngOnInit() { }

  public async ngOnChanges() {
    if (this.currentRiskType != null && this.currentIdBuilding != null && this.risk == null) {
      const load = await this.loadCtrl.create({ message: 'Patientez...' });
      await load.present();
      try {
        this.risk = await this.repo.get(this.currentRiskType, this.currentIdBuilding);
        this.setValuesAndStartListening();
      } finally {
        await load.dismiss();
      }
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
    this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => this.saveIfValid());
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      this.saveForm();
    }
  }

  private async saveForm() {
    const formModel = this.form.value;
    Object.assign(this.risk, formModel);
    console.log('riskk', this.risk);
    await this.repo.save(this.currentRiskType, this.risk)
      .then(() => {
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

  public ValidWallChanged(e) {
    console.log('euhh', e);
    this.form.controls['wall'].setValue(e);
  }
}
