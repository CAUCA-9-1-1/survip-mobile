import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PictureRepositoryProvider } from './../../providers/repositories/picture-repository';
import { PictureData } from './../../models/picture-data';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import { fabric } from 'fabric';
/**
 * Generated class for the InterventionImplantationPlanSketchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intervention-implantation-plan-sketch',
  templateUrl: 'intervention-implantation-plan-sketch.html',
})
export class InterventionImplantationPlanSketchPage {
  public picture: PictureData;
  public repo: PictureRepositoryProvider;
  private canvas;

  constructor(public navCtrl: NavController, public navParams: NavParams, private controller: InspectionControllerProvider, public viewCtrl: ViewController) {
    this.picture = navParams.get("picture");
    this.repo = navParams.get("repo");
  }

  get pictureUri() {
    if (this.picture.dataUri !== "" || this.picture.dataUri !== null) {
      const validUri = (this.picture.dataUri.indexOf(';base64,') > 0)
      ? this.picture.dataUri
      : 'data:image/jpeg;base64,' + this.picture.dataUri;
      return validUri;
    }
    return '';
  }

  get sketchJson() {
    return this.picture.sketchJson;
  }

  public onCanvasChange($event) {
    console.log('onCanvasChange');
    this.canvas = $event;
  }

  public async onOkay() {
    if (this.canvas) {
      this.canvas.renderAll();

      let json = JSON.stringify(this.canvas.toJSON());
      this.controller.picture.sketchJson = json;

      let imageUri = this.canvas.toDataURL();
      if (imageUri.indexOf(';base64,') > 0)
        imageUri = imageUri.substr(imageUri.indexOf(';base64,') + 8);

      this.picture = {id: this.picture.id, picture:imageUri, dataUri: imageUri, sketchJson: json};
      let idPicture = await this.repo.savePicture(this.picture);
    }
    this.viewCtrl.dismiss();
  }

  public onCancel() {
    this.viewCtrl.dismiss();
  }
}

