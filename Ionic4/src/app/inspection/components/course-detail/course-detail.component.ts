import { Component, OnInit } from '@angular/core';
import { FirestationForlist } from 'src/app/shared/models/firestation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InspectionBuildingCourseLane } from 'src/app/shared/models/inspection-building-course-lane';
import { ModalController, NavParams, AlertController, LoadingController } from '@ionic/angular';
import { FirestationRepositoryProvider } from 'src/app/core/services/repositories/firestation-repository-provider.service';
import { InspectionBuildingCourseRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-course-repository';
import { InspectionBuildingCourseLaneRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-course-lane-repository-provider.service';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { TranslateService } from '@ngx-translate/core';
import { InspectionBuildingCourse } from 'src/app/shared/models/inspection-building-course';
import { UUID } from 'angular2-UUID';
import { debounceTime } from 'rxjs/operators';
import { CourseDetailLaneComponent } from '../course-detail-lane/course-detail-lane.component';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {

  private hasNavigated: boolean = true;
  private idInspectionFormCourse: string;
  public firestations: FirestationForlist[] = [];
  public form: FormGroup;
  public changeOrder = false;
  public labels = {};
  public changeCourseAction: string;

  public get course() {
    return this.courseRepo.currentCourse;
  }

  public get lanes(): InspectionBuildingCourseLane[] {
    if (this.courseRepo.currentCourse != null) {
      return this.courseRepo.currentCourse.lanes.filter(lane => lane.isActive != false)
    } else {
      return [];
    }
  }

  constructor(
    private modalController: ModalController,
    public navParams: NavParams,
    private firestationRepo: FirestationRepositoryProvider,
    private courseRepo: InspectionBuildingCourseRepositoryProvider,
    private courseLaneRepo: InspectionBuildingCourseLaneRepositoryProvider,
    public controller: InspectionControllerProvider,
    private alertCtrl: AlertController,
    private load: LoadingController,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {
    this.createForm();
    this.idInspectionFormCourse = navParams.get('idInspectionBuildingCourse');
  }

  async ngOnInit() {
    this.translateService.get([
      'yes', 'no', 'confirmation', 'courseDetailLeaveMessage', 'warning', 'courseLaneValidationMessage',
      'courseDetailDeleteQuestion', 'waitFormMessage', 'cancel', 'finish', 'courseOrderChange'
    ]).subscribe(labels => {
      this.labels = labels;
    },
      error => {
        console.log(error);
      });
    this.changeCourseOrderAction();
    if (this.hasNavigated) {
      await this.refreshData();
    }
  }

  public ionViewCanLeave() {
    return this.canLeave();
  }

  private async refreshData() {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    await loader.present();
    await this.loadFirestations();
    await this.loadSpecificCourse(this.idInspectionFormCourse);
    await loader.dismiss();
  }

  private canLeave(): Promise<boolean> {
    if (this.form.dirty || !this.form.valid) {
      return new Promise(async (resolve) => {
          const alert = await this.alertCtrl.create({
              header: this.labels['confirmation'],
              message: this.labels['courseDetailLeaveMessage'],
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

  private loadSpecificCourse(idBuildingCourse: string) {
    if (idBuildingCourse == null) {
      this.createPlanCourse();
      this.setValuesAndStartListening();
    } else {
      this.courseRepo.load(this.controller.getMainBuilding().idBuilding, this.idInspectionFormCourse)
        .then(() => {
          this.setValuesAndStartListening();
        });
    }
  }

  public createPlanCourse() {
    const course = new InspectionBuildingCourse();
    course.id = UUID.UUID();
    this.idInspectionFormCourse = course.id;
    course.idBuilding = this.controller.currentInspection.idBuilding;
    course.isActive = true;
    course.lanes = [];
    this.courseRepo.currentCourse = course;
  }

  private async loadFirestations() {
    this.firestations = await this.firestationRepo.getList(this.controller.currentInspection.idCity);
  }

  private createForm() {
    this.form = this.fb.group({ idFirestation: ['', Validators.required] });
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
    if (this.course != null) {
      this.form.patchValue(this.course);
    }
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      this.saveForm();
    }
  }

  private saveForm() {
    const formModel = this.form.value;
    Object.assign(this.course, formModel);
    this.saveCourse();
    this.form.markAsPristine();
  }

  public onChangeOrder(): void {
    this.changeOrder = !this.changeOrder;
    this.changeCourseOrderAction();
  }

  public async onReorderLane(ev: any) {
    this.course.lanes = ev.detail.complete(this.course.lanes);
    await this.setLanesSequenceAndSave();
  }

  public async setLanesSequenceAndSave() {
    for (let i = 0; i < this.course.lanes.length; i++) {
      const item = this.course.lanes[i];
      if (item.sequence !== i + 1) {
        item.sequence = i + 1;
      }
    }
    this.saveCourse();
  }

  public async onClickLane(idInspectionBuildingCourseLane: string) {
    if (idInspectionBuildingCourseLane == null && !this.form.valid) {
      const alert = await this.alertCtrl.create({
        header: this.labels['warning'],
        message: this.labels['courseLaneValidationMessage'],
        buttons: ['Ok']
      });

      alert.present();
    } else {
      this.navigateToLanePage(idInspectionBuildingCourseLane);
    }
  }

  private async navigateToLanePage(idInspectionBuildingCourseLane: string) {
    this.hasNavigated = true;
    const modal = await this.modalController.create({
      component: CourseDetailLaneComponent,
      componentProps: {
        idInspectionBuildingCourseLane,
        idInspectionBuildingCourse: this.idInspectionFormCourse,
        nextSequence: this.course.lanes.length + 1
      }
    });

    modal.present();
    await modal.onDidDismiss();
    await this.refreshData();
  }

  private async onDeleteCourse() {
    const alert = await this.alertCtrl.create({
      header: this.labels['confirmation'],
      message: this.labels['courseDetailDeleteQuestion'],
      buttons: [
        { text: this.labels['no'], role: this.labels['cancel'] },
        {
          text: this.labels['yes'], handler: () => {
            this.deleteCourse().then(() => this.goBack());
          }
        }
      ]
    });
    await alert.present();
  }

  private async saveCourse() {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    await loader.present();
    this.courseRepo.save()
      .then(ok => {
        loader.dismiss();
      }, () => loader.dismiss());
  }

  private async deleteCourse() {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    await loader.present();
    try {
      const result = this.courseRepo.delete();
      return result;
    } finally {
      await loader.dismiss();
    }
  }

  private async goBack() {
    if (await this.canLeave()) {
      this.modalController.dismiss();
    }
  }

  public changeCourseOrderAction() {
    this.changeCourseAction = this.labels['finish'];
    if (!this.changeOrder) {
      this.changeCourseAction = this.labels['courseOrderChange'];
    }
  }
}
