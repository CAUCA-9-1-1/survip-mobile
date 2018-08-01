import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {InspectionBuildingHazardousMaterialForList} from '../../models/inspection-building-hazardous-material-for-list';
import {InspectionBuildingHazardousMaterialRepositoryProvider} from '../../providers/repositories/inspection-building-hazardous-material-repository';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-building-hazardous-materials',
  templateUrl: 'building-hazardous-materials.html',
})
export class BuildingHazardousMaterialsPage {

  private readonly idBuilding: string;
  private readonly name: string;
  hazardousMaterials: InspectionBuildingHazardousMaterialForList[] = [];
  labels = {};

  constructor(
    private load: LoadingController,
    private matRepo: InspectionBuildingHazardousMaterialRepositoryProvider,
    private authService: AuthenticationService,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private translateService : TranslateService) {

    this.idBuilding = navParams.get('idBuilding');
    this.name = navParams.get('name');
  }

    ngOnInit() {
        this.translateService.get([
            'waitFormMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

  async ionViewDidEnter() {
    await this.loadMaterialList();
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(): void{
    this.navCtrl.setRoot('LoginPage');
  }

  private async loadMaterialList() {
    let loader = this.load.create({content: this.labels['waitFormMessage']});
    const result = await this.matRepo.getList(this.idBuilding);
    this.hazardousMaterials = result;
    await loader.dismiss();
  }

  public onItemClick(idBuildingHazardousMaterial: string): void {
    let modal = this.modalCtrl.create('BuildingHazardousMaterialDetailPage', { idBuildingHazardousMaterial: idBuildingHazardousMaterial, idBuilding: this.idBuilding });
    modal.onDidDismiss(() => this.loadMaterialList());
    modal.present();
  }
}
