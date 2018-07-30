import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {BuildingChildPictureRepositoryProvider} from '../../interfaces/building-child-picture-repository-provider';
import {InspectionBuildingChildPictureForWeb} from '../../models/inspection-building-child-picture-for-web';
/**
 * Generated class for the ImageEditionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-edition',
  templateUrl: 'image-edition.html',
})
export class ImageEditionPage {
  public picture: InspectionBuildingChildPictureForWeb;
  public repo: BuildingChildPictureRepositoryProvider;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.picture = navParams.get("picture");
    this.repo = navParams.get("repo");
  }

  get pictureUri() {
    return 'data:image/jpeg;base64,' + this.picture.pictureData;
  }

  get sketchJson() {
    return this.picture.sketchJson;
  }

  ionViewDidLoad() {
  }

  public onJsonChanged($event) {
    this.picture.sketchJson = $event;
    this.repo.save(this.picture);
  }
}
