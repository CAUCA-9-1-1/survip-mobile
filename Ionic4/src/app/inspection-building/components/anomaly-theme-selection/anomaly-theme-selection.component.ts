import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { InspectionBuildingAnomalyRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-anomaly-repository-provider.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-anomaly-theme-selection',
  templateUrl: './anomaly-theme-selection.component.html',
  styleUrls: ['./anomaly-theme-selection.component.scss'],
})
export class AnomalyThemeSelectionComponent implements OnInit {

  public currentSearch: string = '';
  public themes: string[] = [];
  public filteredThemes: string[] = [];
  public labels = {};

  constructor(
    private loadCtrl: LoadingController,
    private repo: InspectionBuildingAnomalyRepositoryProvider,
    private toastCtrl: ToastController,
    private modalController: ModalController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    private translateService: TranslateService
  ) { }

  async ngOnInit() {
    this.translateService.get([
      'waitFormMessage', 'themeValidationMessage', 'cancel', 'themeCreationTitle', 'themeCreationMessage',
      'themeNameHolder'
    ]).subscribe(
      labels => this.labels = labels,
      error => console.log(error));

    const load = await this.loadCtrl.create({ message: this.labels['waitFormMessage'] });
    await load.present();
    try {
      this.themes = await this.repo.getThemes();
      Object.assign(this.filteredThemes, this.themes);
      this.sortFilteredThemes();
    } finally {
      load.dismiss();
    }
  }

  public onCreateTheme() {
    this.showPrompt();
  }

  public onSearch(ev: any) {
    const value = ev.target.value;
    if (value != null && value.trim().toLowerCase().length > 0) {
      Object.assign(this.filteredThemes, this.themes);
      this.filteredThemes = this.filteredThemes.filter((item) => {
        return (item.toLowerCase().indexOf(value.toLowerCase().trim()) > -1);
      });
    } else {
      Object.assign(this.filteredThemes, this.themes);
    }
    this.sortFilteredThemes();
  }

  private sortFilteredThemes() {
    this.filteredThemes = this.filteredThemes.sort((theme1, theme2) => {
      if (theme1 > theme2) {
        return 1;
      }
      if (theme2 > theme1) {
        return -1;
      }
      return 0;
    });
  }

  public onSelectExistingTheme(theme: string) {
    this.modalController.dismiss({ hasSelected: true, selectedTheme: theme });
  }

  public onCancel() {
    this.modalController.dismiss({ hasSelected: false });
  }

  private async showMessage() {
    const toast = await this.toastCtrl.create({ message: this.labels['themeValidationMessage'], duration: 3000 });
    await toast.present();
  }

  private async showPrompt() {
    const prompt = await this.alertCtrl.create({
      header: this.labels['themeCreationTitle'],
      inputs: [{ name: 'themeName', placeholder: this.labels['themeNameHolder'], value: this.currentSearch }],
      buttons: [{ text: this.labels['cancel'] }, {
        text: 'Ok', handler: data => {
          const themeSelected = data.themeName;
          if (themeSelected.trim().length === 0) {
            this.showMessage();
          } else {
            this.modalController.dismiss({ hasSelected: true, selectedTheme: themeSelected });
          }
        }
      }]
    });
    prompt.present();
  }
}
