import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {BuildingContactRepositoryProvider} from '../../providers/repositories/building-contact-repository';
import {InspectionBuildingContactForList} from '../../models/inspection-building-contact-for-list';
import {AuthenticationService} from '../../providers/Base/authentification.service';

@IonicPage()
@Component({
  selector: 'page-building-contacts',
  templateUrl: 'building-contacts.html',
})
export class BuildingContactsPage {

  private readonly idBuilding: string;
  private readonly name: string;
  public contacts: InspectionBuildingContactForList[] = [];

  constructor(
    private load: LoadingController,
    private contactRepo: BuildingContactRepositoryProvider,
    private authService: AuthenticationService,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.idBuilding = navParams.get('idBuilding');
    this.name = navParams.get('name');
  }

  ionViewDidLoad() {
  }

  async ionViewDidEnter() {
    await this.loadContactList();
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(): void{
    this.navCtrl.setRoot('LoginPage');
  }

  private async loadContactList() {
    let loader = this.load.create({content: 'Patientez...'});
    const result = await this.contactRepo.getList(this.idBuilding);
    this.contacts = result;
    await loader.dismiss();
  }

  public onItemClick(idBuildingContact: string): void {
    let modal = this.modalCtrl.create('BuildingContactDetailPage', { idBuildingContact: idBuildingContact });
    modal.present();
  }
}
