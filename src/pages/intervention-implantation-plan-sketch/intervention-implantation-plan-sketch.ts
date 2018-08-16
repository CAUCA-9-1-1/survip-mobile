import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PictureRepositoryProvider } from './../../providers/repositories/picture-repository';
import { PictureData } from './../../models/picture-data';
import { InspectionControllerProvider } from '../../providers/inspection-controller/inspection-controller';
import { Gesture } from 'ionic-angular/gestures/gesture';
import { fabric } from 'fabric';

@IonicPage()
@Component({
  selector: 'page-intervention-implantation-plan-sketch',
  templateUrl: 'intervention-implantation-plan-sketch.html',
})
export class InterventionImplantationPlanSketchPage {
  public labels = {};
  public picture: PictureData;
  public repo: PictureRepositoryProvider;

  private canvas;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private controller: InspectionControllerProvider,
              public viewCtrl: ViewController) {
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
    this.canvas = $event;
  }

  public async onOkay() {
    if (this.canvas) {
      let json = JSON.stringify(this.canvas.toJSON());

      this.canvas.zoomToPoint(new fabric.Point(0, 0), 1);
      this.canvas.absolutePan(new fabric.Point(0, 0));

      let imageUri = this.canvas.toDataURL();
      if (imageUri.indexOf(';base64,') > 0)
        imageUri = imageUri.substr(imageUri.indexOf(';base64,') + 8);

      this.picture = {id: this.picture.id, picture:imageUri, dataUri: imageUri, sketchJson: json};
      this.controller.picture = this.picture;
      let idPicture = await this.repo.savePicture(this.picture);
    }
    this.viewCtrl.dismiss();
  }

  public onCancel() {
    this.viewCtrl.dismiss();
  }
}

