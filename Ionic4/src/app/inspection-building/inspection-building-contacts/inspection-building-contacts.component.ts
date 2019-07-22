import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { InspectionBuildingContact } from 'src/app/shared/models/inspection-building-contact';
import { ModalController, LoadingController } from '@ionic/angular';
import { BuildingContactRepositoryProvider } from 'src/app/core/services/repositories/building-contact-repository';
import { BuildingContactDetailComponent } from '../components/building-contact-detail/building-contact-detail.component';

@Component({
  selector: 'app-inspection-building-contacts',
  templateUrl: './inspection-building-contacts.component.html',
  styleUrls: ['./inspection-building-contacts.component.scss'],
})
export class InspectionBuildingContactsComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  public contacts: InspectionBuildingContact[] = [];

  constructor(
    private controller: InspectionControllerProvider,
    private load: LoadingController,
    private modalController: ModalController,
    private contactRepo: BuildingContactRepositoryProvider) { }

  ngOnInit() {
    if (this.controller.inspectionIsLoaded) {
      this.loadContactList();
    } else {
      this.controller.inspectionLoaded.subscribe(() => this.loadContactList());
    }
  }

  private async loadContactList() {
    const loader = await this.load.create({message: 'Patientez...'});
    await loader.present();
    try {
      const contact = await this.contactRepo.getList(this.controller.currentIdBuilding);
      this.contacts = contact;
    } finally {
      await loader.dismiss();
    }
}

public async onItemClick(idBuildingContact: string): Promise<void> {
    const modal = await this.modalController.create({
      component: BuildingContactDetailComponent,
      componentProps: {
        idBuildingContact,
        idBuilding: this.controller.currentIdBuilding
      }
    });

    modal.onDidDismiss().then(() => this.loadContactList());
    await modal.present();
  }
}
