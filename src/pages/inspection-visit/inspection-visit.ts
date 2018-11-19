import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InspectionDetailRepositoryProvider} from "../../providers/repositories/inspection-detail-repository-provider.service";
import {InspectionControllerProvider} from "../../providers/inspection-controller/inspection-controller";
import {InspectionVisit} from "../../models/inspection-visit";
import {InterventionGeneralPage} from "../intervention-general/intervention-general";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
import {isNodeMatchingSelectorWithNegations} from '@angular/core/src/render3/node_selector_matcher';

@IonicPage()
@Component({
    selector: 'page-inspection-visit',
    templateUrl: 'inspection-visit.html',
})
export class InspectionVisitPage {

    private ownerAbsent: boolean = false;
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
                private inspectionDetailProvider: InspectionDetailRepositoryProvider,
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
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();
      return new Date(year + 1, month, day)
    }

    private getFormattedDate(date: Date): string {
      var dd = date.getDate() + '';
      var mm = (date.getMonth() + 1) + '';

      var year = date.getFullYear();
      if (date.getDate() < 10) {
        dd = '0' + date.getDate();
      }
      if ((date.getMonth() + 1) < 10) {
        mm = '0' + (date.getMonth() + 1);
      }
      var todayFormatted = year + '-' + mm + '-' + dd;
      return todayFormatted;
    }

    public UpdateVisitRefusalReason() {
        if ((!this.ownerAbsent) && (this.refusalReason == '')) {
            this.messageTools.showToast(this.labels['visitRefusedValidationMessage'], 3);
            return;
        }

        this.completRefusal = true;

        const visit = new InspectionVisit();
        visit.idInspection = this.inspectionController.idInspection;
        visit.DoorHangerHasBeenLeft = this.doorHangerHasBeenLeft;
        visit.hasBeenRefused = !this.ownerAbsent;
        visit.OwnerWasAbsent = this.ownerAbsent;
        visit.reasonForInspectionRefusal = this.refusalReason;
        visit.RequestedDateOfVisit = this.requestedDateOfVisit;
        visit.isVacant = false;
        visit.isSeasonal = false;
        visit.isActive = true;
        visit.endedOn = new Date();
        visit.status = this.inspectionDetailProvider.InspectionVisitStatusEnum.Completed;

        this.inspectionDetailProvider.RefuseInspectionVisit(visit)
            .subscribe(success => {
                this.navCtrl.pop()
            }, error => {
            });
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
