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
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-anomaly-theme-selection',
  templateUrl: 'anomaly-theme-selection.html',
})
export class AnomalyThemeSelectionPage {

  currentSearch: string = "";
  themes: string[] = [];
  filteredThemes: string[] = [];
  labels = {};

  constructor(
    private loadCtrl: LoadingController,
    private repo: InspectionBuildingAnomalyRepositoryProvider,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private translateService: TranslateService) {
  }

    ngOnInit() {
        this.translateService.get([
            'waitFormMessage', 'themeValidationMessage', 'cancel', 'themeCreationTitle', 'themeCreationMessage',
            'themeNameHolder'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

  async ionViewDidLoad() {
    let load = this.loadCtrl.create({'content': this.labels['waitFormMessage']});
    await load.present();
    this.themes = await this.repo.getThemes();
    Object.assign(this.filteredThemes, this.themes);
    this.sortFilteredThemes();
    load.dismiss();
  }

  onCreateTheme() {
    this.showPrompt();
  }

  onSearch(ev: any) {
    let value = ev.target.value;
    if (value != null && value.trim().toLowerCase().length > 0) {
      Object.assign(this.filteredThemes, this.themes);
      this.filteredThemes = this.filteredThemes.filter((item) => {
        return (item.toLowerCase().indexOf(value.toLowerCase().trim()) > -1);
      });
    }
    else
      Object.assign(this.filteredThemes, this.themes);
    this.sortFilteredThemes();
  }

  private sortFilteredThemes() {
    this.filteredThemes = this.filteredThemes.sort((theme1, theme2) => {
      if (theme1 > theme2)
        return 1;
      if (theme2 > theme1)
        return -1;
      return 0;
    });
  }

  onSelectExistingTheme(theme: string) {
    this.viewCtrl.dismiss({'hasSelected': true, selectedTheme: theme});
  }

  onCancel() {
    this.viewCtrl.dismiss({'hasSelected': false});
  }

  private showMessage() {
    let toast = this.toastCtrl.create({message: this.labels['themeValidationMessage'], duration: 3000});
    toast.present();
  }

  private showPrompt() {
    let prompt = this.alertCtrl.create({
      title:this.labels['themeCreationTitle'],
      message: this.labels['themeCreationMessage'],
      inputs: [{name:'themeName', placeholder: this.labels['themeNameHolder'], value: this.currentSearch}],
      buttons: [{text:this.labels['cancel']}, {text: 'Ok', handler: data => {
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
