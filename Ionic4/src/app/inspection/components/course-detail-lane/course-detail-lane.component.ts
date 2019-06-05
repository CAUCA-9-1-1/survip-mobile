import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouteDirection } from 'src/app/shared/models/route-direction';
import { InspectionBuildingCourseLane } from 'src/app/shared/models/inspection-building-course-lane';
import { InspectionBuildingCourseLaneRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-course-lane-repository-provider.service';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { LaneRepositoryProvider } from 'src/app/core/services/repositories/lane-repository';
import { RouteDirectionRepositoryProvider } from 'src/app/core/services/repositories/route-direction-repository';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-UUID';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-course-detail-lane',
  templateUrl: './course-detail-lane.component.html',
  styleUrls: ['./course-detail-lane.component.scss'],
})
export class CourseDetailLaneComponent implements OnInit {

  private idInspectionBuildingCourseLane: string;
  private readonly idInspectionBuildingCourse: string;
  private readonly nextSequence: number;

  public form: FormGroup;
  public directions: RouteDirection[];
  public courseLane: InspectionBuildingCourseLane;
  public labels = {};
  public isNewRecord: boolean = false;

  constructor(
    public navParams: NavParams,
    private load: LoadingController,
    private courseLaneRepo: InspectionBuildingCourseLaneRepositoryProvider,
    public controller: InspectionControllerProvider,
    private fb: FormBuilder,
    public laneRepo: LaneRepositoryProvider,
    private alertCtrl: AlertController,
    private directionRepo: RouteDirectionRepositoryProvider,
    private translateService: TranslateService,
    private modalController: ModalController
  ) {
    this.idInspectionBuildingCourseLane = navParams.get('idInspectionBuildingCourseLane');
    this.idInspectionBuildingCourse = navParams.get('idInspectionBuildingCourse');
    this.nextSequence = navParams.get('nextSequence');
    this.createForm();
  }

  async ngOnInit() {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    await loader.present();
    try {
      this.directions = await this.directionRepo.getList();
      await this.loadSpecificCourseLane(this.idInspectionBuildingCourseLane);
    } finally {
      await loader.dismiss();
    }

    this.translateService.get([
      'yes', 'no', 'confirmation', 'laneLeaveMessage', 'waitFormMessage', 'cancel', 'laneDeleteQuestion'
    ]).subscribe(labels => {
      this.labels = labels;
    },
      error => {
        console.log(error);
      });
  }

  ionViewCanLeave() {
    return this.canLeave();
  }

  public async loadSpecificCourseLane(idInspectionBuildingCourseLane: string) {
    if (idInspectionBuildingCourseLane == null) {
      this.createPlanCourseLane();
    } else {
      this.courseLane = this.courseLaneRepo.getLane(idInspectionBuildingCourseLane);
    }
    this.setValuesAndStartListening();
  }

  public createPlanCourseLane() {
    const lane = new InspectionBuildingCourseLane();
    lane.id = UUID.UUID();
    this.idInspectionBuildingCourseLane = lane.id;
    lane.idBuildingCourse = this.idInspectionBuildingCourse;
    lane.direction = 2;
    lane.sequence = this.nextSequence;
    lane.isActive = true;
    this.courseLane = lane;
    this.isNewRecord = true;
  }

  public canLeave(): Promise<boolean> {
    if (this.form.dirty || !this.form.valid) {
      return new Promise(async (resolve) => {
        const alert = await this.alertCtrl.create({
          header: this.labels['confirmation'],
          message: this.labels['laneLeaveMessage'],
          buttons: [
            {
              text: this.labels['no'], handler: () => {
                resolve(false);
              }
            },
            {
              text: this.labels['yes'], handler: () => {
                resolve(true);
              }
            }
          ]
        });

        return await alert.present();
      });
    } else {
      return Promise.resolve(true);
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      idLane: ['', Validators.required],
      direction: [0]
    });
  }

  public setValuesAndStartListening() {
    this.setValues();
    this.startWatchingForm();
  }

  private startWatchingForm() {
    this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => this.saveIfValid());
  }

  private setValues() {
    if (this.courseLane != null) {
      this.form.patchValue(this.courseLane);
    }
  }

  private async saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      await this.saveForm();
    }
  }

  private async saveForm() {
    const formModel = this.form.value;
    Object.assign(this.courseLane, formModel);
    await this.saveCourseLane();
    this.form.markAsPristine();
  }

  public async onDeleteLane() {
    const alert = await this.alertCtrl.create({
      header: this.labels['confirmation'],
      message: this.labels['laneDeleteQuestion'],
      buttons: [
        { text: this.labels['no'], role: this.labels['cancel'] },
        {
          text: this.labels['yes'], handler: () => {
            this.deleteThenGoBack();
          }
        }
      ]
    });

    await alert.present();
  }

  public async deleteThenGoBack() {
    await this.deleteCourseLane();
    this.goBack();
  }

  public async saveCourseLane() {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    await loader.present();
    try {
      await this.courseLaneRepo.save(this.courseLane);
      this.isNewRecord = false;
    } finally {
      await loader.dismiss();
    }
  }

  public async deleteCourseLane(): Promise<any> {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    await loader.present();
    const result = await this.courseLaneRepo.delete(this.courseLane);
    await loader.dismiss();
    return result;
  }

  private async goBack() {
    if (await this.canLeave()) {
      this.modalController.dismiss();
    }
  }
}
