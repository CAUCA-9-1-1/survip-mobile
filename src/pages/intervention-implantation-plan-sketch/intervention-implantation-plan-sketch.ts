import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PictureRepositoryProvider } from './../../providers/repositories/picture-repository';
import { InspectionControllerProvider } from '../../providers/inspection-controller/inspection-controller';
import { fabric } from 'fabric';
import {InspectionPictureForWeb} from "../../models/inspection-picture-for-web";

@IonicPage()
@Component({
  selector: 'page-intervention-implantation-plan-sketch',
  templateUrl: 'intervention-implantation-plan-sketch.html',
})
export class InterventionImplantationPlanSketchPage {
  public picture: InspectionPictureForWeb;
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
      return this.picture.pictureData;
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

      this.picture = {id: this.picture.id, pictureData:imageUri, sketchJson: json, idParent: null, idPicture:this.picture.id, modified:true};
    }
    this.viewCtrl.dismiss(this.picture);
  }

  public onCancel() {
    this.viewCtrl.dismiss(this.picture);
  }
}

