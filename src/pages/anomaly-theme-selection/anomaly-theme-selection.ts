import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import {InspectionBuildingAnomalyRepositoryProvider} from '../../providers/repositories/inspection-building-anomaly-repository-provider.service';

@IonicPage()
@Component({
  selector: 'page-anomaly-theme-selection',
  templateUrl: 'anomaly-theme-selection.html',
})
export class AnomalyThemeSelectionPage {

  public currentSearch: string = "";
  public themes: string[] = [];
  public filteredThemes: string[] = [];

  constructor(
    private loadCtrl: LoadingController,
    private repo: InspectionBuildingAnomalyRepositoryProvider,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  async ionViewDidLoad() {
    let load = this.loadCtrl.create({'content': 'Patientez...'});
    await load.present();
    this.themes = await this.repo.getThemes();
    Object.assign(this.filteredThemes, this.themes);
    load.dismiss();
  }

  public onCreateTheme() {
    this.showPrompt();
  }

  public onSearch(ev: any) {
    let value = ev.target.value;
    Object.assign(this.filteredThemes, this.themes);
    this.filteredThemes = this.filteredThemes.filter((item) =>{
      return (item.toLowerCase().indexOf(value.toLowerCase().trim()) > -1);
    });

    this.filteredThemes = this.filteredThemes.sort((theme1, theme2) => {
      if (theme1 > theme2)
        return 1;
      if (theme2 > theme1)
        return -1;
      return 0;
    });
  }

  public onSelectExistingTheme(theme: string) {
    this.viewCtrl.dismiss({'hasSelected': true, selectedTheme: theme});
  }

  public onCancel() {
    this.viewCtrl.dismiss({'hasSelected': false});
  }

  private showMessage() {
    let toast = this.toastCtrl.create({message: 'Le thème doit avoit au moins un caractère.', duration: 3000});
    toast.present();
  }

  private showPrompt() {
    let prompt = this.alertCtrl.create({
      title:"Nouveau thème",
      message: 'Entrez le nom du nouveau thème',
      inputs: [{name:'themeName', placeholder: 'Nom du thème', value: this.currentSearch}],
      buttons: [{text:'Annuler'}, {text: 'Ok', handler: data => {
        let themeSelected = data.themeName;
        if (themeSelected.trim().length == 0)
          this.showMessage();
        else
          this.viewCtrl.dismiss({'hasSelected': true, selectedTheme: themeSelected});
        }}]
    });
    prompt.present();
  }
}
