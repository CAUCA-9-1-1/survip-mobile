import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InspectionDetailRepositoryProvider} from "../../providers/repositories/inspection-detail-repository-provider.service";
import {InspectionControllerProvider} from "../../providers/inspection-controller/inspection-controller";
import {InspectionVisit} from "../../models/inspection-visit";
import {InterventionGeneralPage} from "../intervention-general/intervention-general";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";

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
          text: 'Clear',handler: () => this.requestedDateOfVisit=null}]
      };
  private completRefusal: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private inspectionDetailProvider: InspectionDetailRepositoryProvider,
              private inspectionController: InspectionControllerProvider,
              private messageTools: MessageToolsProvider,) {
      this.ownerAbsent = this.navParams.get('ownerAbsent');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionVisitPage');
  }

    UpdateVisitRefusalReason()
    {
      if((!this.ownerAbsent) && (this.refusalReason == ''))
      {
          this.messageTools.showToast('Veuillez préalablement entrer la raison du refus de la visite d\'inspection.', 3);
          return;
      }

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
          .subscribe( success => {this.navCtrl.pop()}, error =>{});
    }

    ionViewWillLeave(){
    let goToPage = 'InspectionListPage';
    if(!this.completRefusal){
      goToPage = 'InterventionGeneralPage'
    }
        this.navCtrl.setRoot(goToPage);
        this.navCtrl.popToRoot();
    }

}
