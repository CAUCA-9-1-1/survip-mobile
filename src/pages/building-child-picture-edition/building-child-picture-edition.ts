import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {BuildingChildPictureRepositoryProvider} from '../../interfaces/building-child-picture-repository-provider';
import {InspectionBuildingChildPictureForWeb} from '../../models/inspection-building-child-picture-for-web';
import { fabric } from 'fabric';

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
    return this.picture.pictureData;
  }

  get sketchJson() {
    return this.picture.sketchJson;
  }

  onCanvasChange($event) {
    this.canvas = $event;

  }

  async onOkay() {
    if (this.canvas) {
       let json = JSON.stringify(this.canvas.toJSON());

       this.canvas.zoomToPoint(new fabric.Point(0, 0), 1);
       this.canvas.absolutePan(new fabric.Point(0, 0));

       let imageUri = this.canvas.toDataURL();

      this.picture = {id: this.picture.id, idParent: this.picture.idParent, idPicture: this.picture.idPicture, pictureData: imageUri, sketchJson: json, modified:this.isCanvasModified(json) };
    }
    this.viewCtrl.dismiss(this.picture);
  }

  private isCanvasModified(newSketchJson){
    if(JSON.stringify(this.sketchJson) != newSketchJson){
        return true;
    }
    return false;
  }

  onCancel() {
    this.viewCtrl.dismiss(this.picture);
  }
}
