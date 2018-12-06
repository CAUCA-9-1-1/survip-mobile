import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {PicturesRepositoryProvider} from '../../interfaces/pictures-repository-provider.interface';
import {InspectionPictureForWeb} from '../../models/inspection-picture-for-web';
import { fabric } from 'fabric';

@IonicPage()
@Component({
  selector: 'page-building-child-picture-edition',
  templateUrl: 'building-child-picture-edition.html'
})
export class BuildingChildPictureEditionPage {
  public picture: InspectionPictureForWeb;
  public repo: PicturesRepositoryProvider;

  private canvas;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.picture = navParams.get("picture");
    this.repo = navParams.get("repo");
  }

  get pictureUri() {
    return this.picture.dataUri;
  }

  get sketchJson() {
    return this.picture.sketchJson;
  }

  public onCanvasChange($event) {
    this.canvas = $event;
  }

  public async onOkay() {
    if (this.canvas) {
       const json = this.canvas.toJSON(['width', 'height']);

       this.getFullSizeImage(json).then((res) => {
        const imageUri = res;
        this.picture = {id: this.picture.id, idParent: this.picture.idParent, idPicture: this.picture.idPicture, dataUri: imageUri, sketchJson: JSON.stringify(json), modified:true };
        this.viewCtrl.dismiss(this.picture);
      });
    }
    else
      this.viewCtrl.dismiss();
  }

  public onCancel() {
    this.viewCtrl.dismiss(this.picture);
  }

  
  private getFullSizeImage(json: JSON) : Promise<string> {
    let fullSizeCanvas = new fabric.Canvas('1');
    return new Promise(
        (resolve): void => {
        fullSizeCanvas = fullSizeCanvas.loadFromJSON(json, 
            () => {
                fullSizeCanvas.renderAll.bind(fullSizeCanvas);
            fullSizeCanvas.renderAll();
            const backgroundImage = json['backgroundImage'];

            let scaleFactor = 1 / backgroundImage.scaleX;

            this.setFullSizeCanvasSize(fullSizeCanvas, json, scaleFactor);
            this.setFullSizeBackground(fullSizeCanvas, scaleFactor, backgroundImage);
            const objects = fullSizeCanvas.getObjects();
            this.setFullsizeObjects(objects, scaleFactor);

        
            fullSizeCanvas.renderAll();
            resolve(fullSizeCanvas.toDataURL());
        }
      );
    })
}

private setFullSizeCanvasSize(fullSizeCanvas: fabric.Canvas, json: JSON, scaleFactor: number) {
    fullSizeCanvas.setWidth(json['width'] * scaleFactor);
    fullSizeCanvas.setHeight(json['height'] * scaleFactor);
}

private setFullSizeBackground(fullSizeCanvas: fabric.Canvas, scaleFactor: number, backgroundImage: fabric.Image) {
    const left = backgroundImage.left;
    const top = backgroundImage.top;
    
    fullSizeCanvas.setBackgroundImage(fullSizeCanvas.backgroundImage, fullSizeCanvas.renderAll.bind(fullSizeCanvas), {
        top: top * scaleFactor,
        left: left * scaleFactor,
        originX: 'left',
        originY: 'top',
        scaleX: 1,
        scaleY: 1
    });
}

private setFullsizeObjects(objects: Array<fabric.Object>, scaleFactor: number) {
    for (const obj of objects) {
        obj.left *= scaleFactor;
        obj.scaleX *= scaleFactor;
        obj.scaleY *= scaleFactor;
        obj.top *= scaleFactor;
        obj.setCoords();
    }
  }
}
