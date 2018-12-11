import {Component, OnDestroy} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {ISubscription} from 'rxjs/Subscription';
import {PictureRepositoryProvider} from "../../providers/repositories/picture-repository";

@IonicPage()
@Component({
    selector: 'page-intervention-implantation-plan',
    templateUrl: 'intervention-implantation-plan.html',
})
export class InterventionImplantationPlanPage implements OnDestroy {
    public form: FormGroup;
    private pictureSubscriber: ISubscription;
    private pictureDeletedSUbscriber: ISubscription;

    constructor(
        private fb: FormBuilder,
        private controller: InspectionControllerProvider,
        public picRepo: PictureRepositoryProvider,) {
        this.createForm();
        this.pictureSubscriber = this.picRepo.picturesChanged.subscribe(() => this.picturesUpdated());
        this.pictureDeletedSUbscriber = this.picRepo.picturesDeleted.subscribe(() => this.pictureDeleted());
    }

    public ngOnDestroy(): void {
        if (this.pictureSubscriber)
            this.pictureSubscriber.unsubscribe();
    }

    private createForm() {
        this.form = this.fb.group({
            id: [this.controller.inspectionDetail.idPictureSitePlan ? this.controller.inspectionDetail.idPictureSitePlan : ''],
            picture: [''],
            dataUri: [''],
            sketchJson: [''],
            idParent: [this.controller.inspectionDetail.idPictureSitePlan ? this.controller.inspectionDetail.idPictureSitePlan : '']});
    }


    private async picturesUpdated() {
        this.form.markAsDirty();
        this.form.updateValueAndValidity();
        if(this.picRepo.pictures.length > 0) {
            await this.picRepo.save(this.picRepo.pictures[0]);
            this.controller.savePlanIdPicture(this.picRepo.pictures[0].id);
        }
    }

    private pictureDeleted(){
        this.controller.inspectionDetail.idPictureSitePlan = '';
    }
}
