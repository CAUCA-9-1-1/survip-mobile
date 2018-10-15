import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {PicturesRepositoryProvider} from '../../interfaces/pictures-repository-provider.interface';
import {InspectionBuildingChildPictureForWeb} from '../../models/inspection-building-child-picture-for-web';
import { fabric } from 'fabric';

@IonicPage()
@Component({
  selector: 'page-building-child-picture-edition',
  templateUrl: 'building-child-picture-edition.html'
})
export class BuildingChildPictureEditionPage {
  public picture: InspectionBuildingChildPictureForWeb;
  public repo: PicturesRepositoryProvider;

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

  public onCanvasChange($event) {
    this.canvas = $event;
  }

  public async onOkay() {
    if (this.canvas) {
       let json = JSON.stringify(this.canvas.toJSON());

       this.canvas.zoomToPoint(new fabric.Point(0, 0), 1);
       this.canvas.absolutePan(new fabric.Point(0, 0));

       let imageUri = this.canvas.toDataURL();

      this.picture = {id: this.picture.id, idParent: this.picture.idParent, idPicture: this.picture.idPicture, pictureData: imageUri, sketchJson: json, modified:true };
    }
    this.viewCtrl.dismiss(this.picture);
  }

  public onCancel() {
    this.viewCtrl.dismiss(this.picture);
  }
}
