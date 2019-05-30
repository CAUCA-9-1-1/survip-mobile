import { Component, OnInit } from '@angular/core';
import { InspectionBuildingCourseForList } from 'src/app/shared/models/inspection-building-course-for-list';
import { Inspection } from 'src/app/shared/interfaces/inspection.interface';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { LoadingController, ModalController } from '@ionic/angular';
import { InspectionBuildingCourseRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-course-repository';
import { TranslateService } from '@ngx-translate/core';
import { CourseDetailComponent } from '../components/course-detail/course-detail.component';

@Component({
  selector: 'app-inspection-courses',
  templateUrl: './inspection-courses.component.html',
  styleUrls: ['./inspection-courses.component.scss'],
})
export class InspectionCoursesComponent implements OnInit {

  public courses: InspectionBuildingCourseForList[] = [];
  public labels = {};

  public get currentInspection(): Inspection {
    return this.controller.currentInspection;
  }

  constructor(
    private modalController: ModalController,
    public controller: InspectionControllerProvider,
    private load: LoadingController,
    private courseRepo: InspectionBuildingCourseRepositoryProvider,
    private translateService: TranslateService
  ) {
    if (this.controller.inspectionIsLoaded) {
      this.loadCourseList();
    } else {
      this.controller.inspectionLoaded.subscribe(() => this.loadCourseList());
    }
  }

  ngOnInit() {
    this.translateService.get([
      'waitFormMessage'
    ]).subscribe(labels => {
      this.labels = labels;
    },
      error => {
        console.log(error)
      });
  }

  public async loadCourseList() {
    const loader = await this.load.create({ message: this.labels['waitFromMessage'] });
    await loader.present();
    this.courseRepo.getList(this.controller.getMainBuilding().idBuilding, this.controller.currentInspection.idCity)
      .then(data => {
        this.courses = data;
        loader.dismiss();
      });
  }

  public async onItemClick(idInspectionBuildingCourse: string) {
    const modal = await this.modalController.create({
        component: CourseDetailComponent,
        componentProps: { idInspectionBuildingCourse }
    });

    modal.present();
    await modal.onWillDismiss();
    await this.loadCourseList();
  }
}
