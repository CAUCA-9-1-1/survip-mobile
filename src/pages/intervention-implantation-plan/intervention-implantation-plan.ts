import {Component, OnDestroy} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {ISubscription} from 'rxjs/Subscription';
import {PictureRepositoryProvider} from "../../providers/repositories/picture-repository";
import {BuildingDetailRepositoryProvider} from "../../providers/repositories/building-detail-repository";
import {InspectionBuildingDetail} from "../../models/inspection-building-detail";

@IonicPage()
@Component({
    selector: 'page-intervention-implantation-plan',
    templateUrl: 'intervention-implantation-plan.html',
})
export class InterventionImplantationPlanPage implements OnDestroy {
  private pictureSubscriber: ISubscription;
  private pictureDeletedSUbscriber: ISubscription;
  private detail: InspectionBuildingDetail;

  public get IdBuilding(){
    return this.detail != null ? this.detail.idBuilding : null;
  }
    constructor(
        private controller: InspectionControllerProvider,
        private detailRepo: BuildingDetailRepositoryProvider,
        public picRepo: PictureRepositoryProvider,) {
        this.pictureSubscriber = this.picRepo.picturesChanged.subscribe(() => this.picturesUpdated());
        this.pictureDeletedSUbscriber = this.picRepo.picturesDeleted.subscribe(() => this.pictureDeleted());
    }

    public async ionViewDidEnter() {
      this.detail = await this.detailRepo.get(this.controller.currentInspection.idBuilding);
    }

    public ngOnDestroy(): void {
        if (this.pictureSubscriber)
            this.pictureSubscriber.unsubscribe();
    }

    private async picturesUpdated() {
        if(this.picRepo.pictures.length > 0) {
            this.picRepo.pictures[0].hasBeenModified = true;
            await this.picRepo.save(this.detail.idBuilding, this.picRepo.pictures);
            this.detail.idPicturePlan = this.picRepo.pictures[0].id;
        } else {
          this.detail.idPicturePlan = null;
        }
        await this.detailRepo.save(this.detail);
    }

    private async pictureDeleted(){
      if (this.picRepo.pictures.length > 0){
        await this.picRepo.delete(this.detail.idBuilding, this.picRepo.pictures[0].id);
      }
      this.detail.idPicturePlan = null;
      await this.detailRepo.save(this.detail);
    }
}
