import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { InspectionBuildingDetail } from 'src/app/shared/models/inspection-building-detail';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { BuildingDetailRepositoryProvider } from 'src/app/core/services/repositories/building-detail-repository';
import { PictureRepositoryProvider } from 'src/app/core/services/repositories/picture-repository';

@Component({
  selector: 'app-inspection-implantation-plan',
  templateUrl: './inspection-implantation-plan.component.html',
  styleUrls: ['./inspection-implantation-plan.component.scss'],
})
export class InspectionImplantationPlanComponent implements OnInit, OnDestroy {

  private pictureSubscriber: Subscription;
  private pictureDeletedSUbscriber: Subscription;
  private detail: InspectionBuildingDetail;

  public get IdBuilding() {
    return this.detail != null ? this.detail.idBuilding : null;
  }

  constructor(
    private controller: InspectionControllerProvider,
    private detailRepo: BuildingDetailRepositoryProvider,
    public picRepo: PictureRepositoryProvider,
  ) {
    this.pictureSubscriber = this.picRepo.picturesChanged.subscribe(() => this.picturesUpdated());
    this.pictureDeletedSUbscriber = this.picRepo.picturesDeleted.subscribe(() => this.pictureDeleted());
  }

  async ngOnInit() {
    if (this.controller.inspectionIsLoaded) {
      this.detail = await this.detailRepo.get(this.controller.currentInspection.idBuilding);
    } else {
      this.controller.inspectionLoaded
        .subscribe(async () => this.detail = await this.detailRepo.get(this.controller.currentInspection.idBuilding));
    }
  }

  public ngOnDestroy(): void {
    if (this.pictureSubscriber) {
      this.pictureSubscriber.unsubscribe();
    }
  }

  private async picturesUpdated() {
    if (this.picRepo.pictures.length > 0) {
      this.picRepo.pictures[0].hasBeenModified = true;
      await this.picRepo.save(this.detail.idBuilding, this.picRepo.pictures);
      this.detail.idPicturePlan = this.picRepo.pictures[0].id;
    } else {
      this.detail.idPicturePlan = null;
    }
    await this.detailRepo.save(this.detail);
  }

  private async pictureDeleted() {
    if (this.picRepo.pictures.length > 0) {
      await this.picRepo.delete(this.detail.idBuilding, this.picRepo.pictures[0].id);
    }
    this.detail.idPicturePlan = null;
    await this.detailRepo.save(this.detail);
  }
}
