import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InspectionControllerProvider} from "../../providers/inspection-controller/inspection-controller";
import {InterventionGeneralPage} from "../intervention-general/intervention-general";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
import {InspectionRepositoryProvider} from "../../providers/repositories/inspection-repository-provider.service";

@IonicPage()
@Component({
    selector: 'page-inspection-visit',
    templateUrl: 'inspection-visit.html',
})
export class InspectionVisitPage {

    private readonly ownerAbsent: boolean = false;

    private refusalReason: string = '';
    private requestedDateOfVisit: Date;
    private doorHangerHasBeenLeft: boolean = false;
    private customOptions = {
        buttons: [{
            text: 'Clear', handler: () => this.requestedDateOfVisit = null
        }]
    };
    private completRefusal: boolean = false;

    public labels = {};
    public minimalNextVisitDate: string = null;
    public maximalNextVisitDate: string = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private inspectionRepo: InspectionRepositoryProvider,
                private inspectionController: InspectionControllerProvider,
                private messageTools: MessageToolsProvider,
                private translateService: TranslateService) {

        this.ownerAbsent = this.navParams.get('ownerAbsent');
        this.minimalNextVisitDate = this.getFormattedDate(new Date());

        this.maximalNextVisitDate = this.getFormattedDate(this.getNextYear())
    }

    public ngOnInit() {
        this.translateService.get([
            'visitRefusedValidationMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    private getNextYear(): Date {
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth();
      let day = d.getDate();
      return new Date(year + 1, month, day)
    }

    private getFormattedDate(date: Date): string {
      let dd = date.getDate() + '';
      let mm = (date.getMonth() + 1) + '';

      let year = date.getFullYear();
      if (date.getDate() < 10) {
        dd = '0' + date.getDate();
      }
      if ((date.getMonth() + 1) < 10) {
        mm = '0' + (date.getMonth() + 1);
      }
      let todayFormatted = year + '-' + mm + '-' + dd;
      return todayFormatted;
    }

    public async updateVisitRefusalReason() {
        if ((!this.ownerAbsent) && (this.refusalReason == '')) {
            this.messageTools.showToast(this.labels['visitRefusedValidationMessage'], 3);
            return;
        }

        this.completRefusal = true;

        await this.inspectionRepo.refuseInspection(this.inspectionController.idInspection, this.ownerAbsent, this.doorHangerHasBeenLeft, this.refusalReason, this.requestedDateOfVisit);
        await this.navCtrl.pop()
    }

    public ionViewWillLeave() {
        let goToPage = 'InspectionListPage';
        if (!this.completRefusal) {
            goToPage = 'InterventionGeneralPage'
        }
        this.navCtrl.setRoot(goToPage);
        this.navCtrl.popToRoot();
    }

}
