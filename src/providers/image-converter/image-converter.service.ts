import { Injectable } from '@angular/core';
import { fabric } from 'fabric';


@Injectable()
export class ImageConverterService {

  constructor() {
  }

  public getFullSizeImage(json: JSON) : Promise<string> {
    let fullSizePicture = null;

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
            fullSizePicture = fullSizeCanvas.toDataURL();
            resolve(fullSizePicture);
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
