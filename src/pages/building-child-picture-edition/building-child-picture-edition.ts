import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
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
  selector: 'page-building-child-picture-edition',
  templateUrl: 'building-child-picture-edition.html'
  //styleUrls: ['building-child-picture-edition.scss']
})
export class BuildingChildPictureEditionPage {
  picture: InspectionBuildingChildPictureForWeb;
  repo: BuildingChildPictureRepositoryProvider;

  private canvas;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
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

  onCanvasChange($event) {
    console.log('onCanvasChange');
    this.canvas = $event;
  }

  async onOkay() {
    if (this.canvas) {
      this.canvas.renderAll();
       let json = JSON.stringify(this.canvas.toJSON());
       let imageUri = this.canvas.toDataURL();
      if (imageUri.indexOf(';base64,') > 0)
        imageUri = imageUri.substr(imageUri.indexOf(';base64,') + 8);

      this.picture = {id: this.picture.id, idParent: this.picture.idParent, idPicture: this.picture.idPicture, pictureData: imageUri, sketchJson: json };

      let idPicture = await this.repo.save(this.picture);

      console.log('Canvas');
    }
    console.log('onOkay');
    this.viewCtrl.dismiss();
  }
   public onCancel() {
    this.viewCtrl.dismiss();
  }
}
