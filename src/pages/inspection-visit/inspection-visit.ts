import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InspectionDetailRepositoryProvider} from "../../providers/repositories/inspection-detail-repository-provider.service";
import {InspectionControllerProvider} from "../../providers/inspection-controller/inspection-controller";
import {InspectionVisit} from "../../models/inspection-visit";

@IonicPage()
@Component({
  selector: 'page-inspection-visit',
  templateUrl: 'inspection-visit.html',
})
export class InspectionVisitPage {

  private ownerAbsent: boolean = false;
  private ownerAbsent: boolean = false;
  private RefusalReason: string = '';
  private requestedDateOfVisit: Date;
  private doorHangerHasBeenLeft: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private inspectionDetailProvider: InspectionDetailRepositoryProvider, private inspectionController: InspectionControllerProvider) {
      this.ownerAbsent = this.navParams.get('ownerAbsent');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionVisitPage');
  }

    UpdateVisit()
    {
      const visit = new InspectionVisit();
      visit.idInspection = this.inspectionController.idInspection;
      visit.DoorHangerHasBeenLeft = this.doorHangerHasBeenLeft;
      visit.hasBeenRefused = !this.ownerAbsent;
      visit.OwnerWasAbsent = this.ownerAbsent;
      visit.reasonForInspectionRefusal = this.RefusalReason;
      visit.RequestedDateOfVisit = this.requestedDateOfVisit;
      this.inspectionDetailProvider.updateInspectionVisit(visit)
          .subscribe( success => {}, error =>{});
    }

}
