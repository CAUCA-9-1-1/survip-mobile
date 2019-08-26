import { Component  } from '@angular/core';
import { InspectionPictureForWeb } from '../../models/inspection-picture-for-web';
import { PicturesRepositoryProvider } from '../../interfaces/pictures-repository-provider.interface';
import { NavParams, ModalController } from '@ionic/angular';
import { fabric } from 'fabric';

@Component({
  selector: 'app-picture-edition',
  templateUrl: './picture-edition.component.html',
  styleUrls: ['./picture-edition.component.scss'],
})
export class PictureEditionComponent {

  public picture: InspectionPictureForWeb;
  public repo: PicturesRepositoryProvider;

  public pictogramsPath = './assets/pictograms/';
  public pictograms = ['AccesPrincipal.png', 'Annonciateur.png', 'BoiteClees.png', 'BorneIncendie.png',
    'CamionPompier.png', 'GazNaturel.png', 'GazPropane.png', 'Generatrice.png'];

  private canvas;

  constructor(private modalController: ModalController, public navParams: NavParams) {
    this.picture = navParams.get('picture');
    this.repo = navParams.get('repo');
  }

  get pictureUri() {
    return this.picture.dataUri;
  }

  get sketchJson() {
    return this.picture.sketchJson;
  }

  public onCanvasChange($event) {

    console.log('onCanvasChanged, $event');

    this.canvas = $event;
  }

  public async onOkay() {
    if (this.canvas) {
       const json = this.canvas.toJSON(['width', 'height']);

       this.getFullSizeImage(json).then((res) => {
        const imageUri = res;
        this.picture.dataUri = imageUri;
        this.picture.sketchJson = JSON.stringify(json);
        this.picture.modified = true;
        this.modalController.dismiss(this.picture);
      });
    } else {
      this.modalController.dismiss();
    }
  }

  public onCancel() {
    this.modalController.dismiss(this.picture);
  }

  private getFullSizeImage(json: JSON): Promise<string> {
    let fullSizeCanvas = new fabric.Canvas('1');
    return new Promise(
        (resolve): void => {
        fullSizeCanvas = fullSizeCanvas.loadFromJSON(json,
            () => {
                fullSizeCanvas.renderAll.bind(fullSizeCanvas);
                fullSizeCanvas.renderAll();
                fullSizeCanvas.zoomToPoint(new fabric.Point(0, 0), 1);
                fullSizeCanvas.absolutePan(new fabric.Point(0, 0));

                const backgroundImage = json['backgroundImage'];
                const scaleFactor = 1 / backgroundImage.scaleX;

                this.setFullSizeCanvasSize(fullSizeCanvas, json, scaleFactor);
                this.setFullSizeBackground(fullSizeCanvas, scaleFactor, backgroundImage);
                const objects = fullSizeCanvas.getObjects();
                this.setFullsizeObjects(objects, scaleFactor);

                fullSizeCanvas.renderAll();
                resolve(fullSizeCanvas.toDataURL({format: 'jpeg', quality: 0.9}));
        }
      );
    });
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

export enum KEY_CODE {
  DELETE = 46,
  BACKSPACE = 8
}

export const SHAPE_DATA = {
  width: 200,
  height: 200,
  left: 50,
  top: 50,
  radius: 100,
  stroke: 10,
  freeDrawingBrushWidth: 10,
  cornerSize: 20
};
