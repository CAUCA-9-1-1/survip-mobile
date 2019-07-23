import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { InspectionRepositoryProvider } from 'src/app/core/services/repositories/inspection-repository-provider.service';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inspection-visit',
  templateUrl: './inspection-visit.component.html',
  styleUrls: ['./inspection-visit.component.scss'],
})
export class InspectionVisitComponent implements OnInit {

  public readonly ownerAbsent: boolean = false;

  public refusalReason: string = '';
  public requestedDateOfVisit: Date;
  public doorHangerHasBeenLeft: boolean = false;
  public customOptions = {
      buttons: [{
          text: 'Clear', handler: () => this.requestedDateOfVisit = null
      }]
  };
  private completRefusal: boolean = false;

  public labels = {};
  public minimalNextVisitDate: string = null;
  public maximalNextVisitDate: string = null;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private navParams: NavParams,
    private inspectionRepo: InspectionRepositoryProvider,
    private inspectionController: InspectionControllerProvider,
    private messageTools: MessageToolsProvider,
    private translateService: TranslateService) {
      this.ownerAbsent = this.navParams.get('ownerAbsent');
      this.minimalNextVisitDate = this.getFormattedDate(new Date());
      this.maximalNextVisitDate = this.getFormattedDate(this.getNextYear());
    }

  ngOnInit() {
    this.translateService.get(['visitRefusedValidationMessage', 'cantUploadAndCompleteInspection'])
    .subscribe(
      labels => this.labels = labels,
      error => console.log(error));
  }

  private getNextYear(): Date {
    const d = new Date();
    return new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
  }

  private getFormattedDate(date: Date): string {
    let dd = date.getDate() + '';
    let mm = (date.getMonth() + 1) + '';

    const year = date.getFullYear();
    if (date.getDate() < 10) {
      dd = '0' + date.getDate();
    }
    if ((date.getMonth() + 1) < 10) {
      mm = '0' + (date.getMonth() + 1);
    }
    const todayFormatted = year + '-' + mm + '-' + dd;
    return todayFormatted;
  }

  public async updateVisitRefusalReason() {
      if ((!this.ownerAbsent) && (this.refusalReason === '')) {
          this.messageTools.showToast(this.labels['visitRefusedValidationMessage'], 3);
          return;
      }

      this.completRefusal = true;

      const successfullySentToServer = await this.inspectionRepo
          .refuseInspection(this.inspectionController.idInspection, this.ownerAbsent,
            this.doorHangerHasBeenLeft, this.refusalReason, this.requestedDateOfVisit);
      if (successfullySentToServer) {
          if (!await this.inspectionRepo.uploadInspection(this.inspectionController.idInspection)) {
              await this.messageTools.showToast(this.labels['cantUploadAndCompleteInspection']);
          }
      } else {
          await this.messageTools.showToast(this.labels['cantUploadAndCompleteInspection']);
      }

      if (this.completRefusal) {
        await this.router.navigate(['/inspection-list']);
        await this.modalController.dismiss();
      } else {
        await this.modalController.dismiss();
      }
  }

  public goBack() {
    this.modalController.dismiss();
  }
}
