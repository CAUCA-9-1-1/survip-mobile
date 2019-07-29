import { Injectable } from '@angular/core';
import { SHAPE_DATA } from '../components/picture-edition/picture-edition.component';
import { AvailableGeometricShape } from '../components/picture-edition/available-geometric-shape';
import 'fabric';

declare let fabric: any;

interface ScaleData {
  scaleFactor: number;
  left: number;
  top: number;
}

interface Position {
  x: number;
  y: number;
}

@Injectable({providedIn: 'root'})
export class CanvasManagerService {

  public canvas;
  public left;

  private cropRectangle: fabric.Rect;
  private mousePosition: Position;
  private lastPanPosition: fabric.Point;
  private canvasId =  'canvas';

  constructor() {
    this.mousePosition = {x: 0, y: 0};
    this.left = 0;
  }

  get canvasObjects() {
    return this.canvas.getObjects();
  }

  get canvasBackgroundImage() {
    return this.canvas.backgroundImage;
  }

  get activeObject() {
    return this.canvas.getActiveObject();
  }

  get activeGroup() {
    return this.canvas.getActiveObjects();
  }

  get divCanvasContainer() {
    const collection = document.getElementsByClassName('div-canvas-container');
    return collection[collection.length - 1];
  }

  public createCanvas(canvasId: string): void {
    this.canvasId = canvasId;
    this.canvas = new fabric.Canvas(this.canvasId);
  }

  public emptyCanvas(): void {
    if (this.canvas) {
      this.canvas.dispose();
    }
    this.canvas = new fabric.Canvas(this.canvasId);
    this.canvas.clear();
    this.canvas.remove(this.canvas.getObjects());
  }

  public loadNewImage(backgroundImageURL?: string): void {
    this.emptyCanvas();
    if (backgroundImageURL) {
      this.setBackgroundFromURL(backgroundImageURL);
    }
  }

  public renderCanvas(): void {
    this.markSelectedObjectsDirty();
    this.canvas.renderAll();
  }

  public addGeometricShape(strokeColor: string, fillColor: string, shape: AvailableGeometricShape): void {
    switch (shape) {
      case AvailableGeometricShape.Rectangle:
        this.addRectangle(strokeColor, fillColor);
        break;
      case AvailableGeometricShape.Circle:
        this.addCircle(strokeColor, fillColor);
        break;
      case AvailableGeometricShape.Triangle:
        this.addTriangle(strokeColor, fillColor);
        break;
      case AvailableGeometricShape.Line:
        this.addHorizontalLine(strokeColor, fillColor);
        break;
      case AvailableGeometricShape.Cross:
        this.addCross(strokeColor, fillColor);
        break;
    }
  }

  private addRectangle(strokeColor: string, fillColor: string): void {
    this.canvas.add(
      new fabric.Rect({
        width: SHAPE_DATA.width,
        height: SHAPE_DATA.height,
        left: SHAPE_DATA.left,
        top: SHAPE_DATA.top,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: SHAPE_DATA.stroke,
        cornerSize: SHAPE_DATA.cornerSize
      })
    );
  }

  private addCircle(strokeColor: string, fillColor: string): void {
    this.canvas.add(
      new fabric.Circle({
        left: SHAPE_DATA.left,
        top: SHAPE_DATA.top,
        radius: SHAPE_DATA.radius,
        stroke: strokeColor,
        strokeWidth: SHAPE_DATA.stroke,
        fill: fillColor,
        cornerSize: SHAPE_DATA.cornerSize
      })
    );
  }

  private addTriangle(strokeColor: string, fillColor: string): void {
    this.canvas.add(
      new fabric.Triangle({
        width: SHAPE_DATA.width,
        height: SHAPE_DATA.height,
        left: SHAPE_DATA.left,
        top: SHAPE_DATA.top,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: SHAPE_DATA.stroke,
        cornerSize: SHAPE_DATA.cornerSize
      })
    );
  }

  private addHorizontalLine(strokeColor: string, fillColor: string): void {
    this.canvas.add(this.createHorizontalLine(strokeColor));
  }

  private createHorizontalLine(strokeColor: string): fabric.Line {
    const line = new fabric.Line([100, 150, 200, 150], {
      left: 50,
      top: 100,
      stroke: strokeColor,
      strokeWidth: 5,
      cornerSize: SHAPE_DATA.cornerSize
    });

    line.setControlsVisibility({
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mt: false,
      mb: false
    });

    return line;
  }

  private createVerticalLine(strokeColor: string): fabric.Line {
    const line = new fabric.Line([150, 100, 150, 200], {
      left: 100,
      top: 50,
      stroke: strokeColor,
      strokeWidth: 5,
      cornerSize: SHAPE_DATA.cornerSize
    });

    line.setControlsVisibility({
      bl: false,
      br: false,
      tl: false,
      tr: false,
      ml: false,
      mr: false
    });

    return line;
  }

  private addCross(strokeColor: string, fillColor: string): void {
    const horizontalLine = this.createHorizontalLine(strokeColor);
    const verticalLine = this.createVerticalLine(strokeColor);
    this.canvas.add(horizontalLine);
    this.canvas.add(verticalLine);
  }

  public toggleFreeDrawing(): void {
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
  }

  public setFreeDrawingBrushColor(color: string): void {
    this.canvas.freeDrawingBrush.color = color;
    this.setFreeDrawingBrushWidthFromZoom(this.canvas.getZoom());
  }

  private setFreeDrawingBrushWidthFromZoom(zoom: number) {
    this.canvas.freeDrawingBrush.width = SHAPE_DATA.freeDrawingBrushWidth * (1 / zoom);
  }

  public addText(color: string, inputText: string): void {
    const text = new fabric.IText('text', {
      fontFamily: 'arial black',
      fontStyle: 'bold',
      left: SHAPE_DATA.left,
      top: SHAPE_DATA.top,
      cornerSize: SHAPE_DATA.cornerSize
    });

    text.setColor(color);

    this.canvas.add(text);
  }

  public addImage(imageURL: string): Promise<void> {
    return new Promise(
      (resolve, reject): void => {
        const canvas = this.canvas;

        const image = new Image();
        image.onload = (img) => {
          const fabricImage = new fabric.Image(image, {
            angle: 0,
            width: image.width,
            height: image.height,
            left: SHAPE_DATA.left,
            top: SHAPE_DATA.top,
            scaleX: 1,
            scaleY: 1,
            cornerSize: SHAPE_DATA.cornerSize
          });
          canvas.add(fabricImage);
          resolve();
        };
        image.src = imageURL;
      }
    );
  }

  public setBackgroundFromURL(backgroundImageURL: string): Promise<void> {
    const container =  this.divCanvasContainer;
    this.setCanvasSize(container.clientWidth, container.clientHeight);

    return new Promise(
      (resolve, reject): void => {
        if (backgroundImageURL == null) {
          return reject();
        }
        const image = new Image();
        image.onload = () => {
          const fabricImage = new fabric.Image(image, {});

          const scaleData = this.computeScaleFactor(fabricImage, this.canvas);

          this.canvas.setBackgroundImage(fabricImage, this.canvas.renderAll.bind(this.canvas), {
            scaleX: scaleData.scaleFactor,
            scaleY: scaleData.scaleFactor
          });

          this.setCanvasSize(fabricImage.width * scaleData.scaleFactor, fabricImage.height * scaleData.scaleFactor);

          this.canvas.renderAll();
          resolve();
        };
        image.src = backgroundImageURL;
      }
    );
  }

  private computeScaleFactor(fabricImage: fabric.Image, canvas: fabric.Canvas): ScaleData {
    const container = this.divCanvasContainer;

    const canvasAspect = container.clientWidth / container.clientHeight;
    const imgAspect = fabricImage.width / fabricImage.height;
    let left, top, scaleFactor;

    if (canvasAspect <= imgAspect) {
      scaleFactor = container.clientWidth / fabricImage.width;
      left = 0;
      top = -(fabricImage.height * scaleFactor - container.clientHeight) / 2;
    } else {
      scaleFactor = container.clientHeight / fabricImage.height;
      top = 0;
      left = -(fabricImage.width * scaleFactor - container.clientWidth) / 2;
    }

    this.left = left;

    return { scaleFactor, left, top };
  }

  public onOrientationChange() {
    this.mousePosition = {x: this.canvas.getWidth, y: this.canvas.getHeight };
    this.cropImage();
  }

  public changeSelectedObjectsFillColor(color: string): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        object.setColor(color);
        this.canvas.renderAll();
      }
    }
  }

  public changeSelectedObjectsStrokeColor(color: string): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        if (object.type === 'i-text') {
          object.setColor(color);
        } else {
          object.stroke = color;
          object.set('dirty', true);
        }
      }
      this.canvas.renderAll();
    }
  }

  public deleteSelectedObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        this.canvas.remove(object);
      }
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    }
  }

  public bringSelectedObjectsToFront(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        this.canvas.bringToFront(object);
      }
    }
  }

  public sendSelectedObjectsToBack(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        this.canvas.sendToBack(object);
      }
    }
  }

  public jsonFromCanvas(): JSON {
    return this.canvas.toJSON(['width', 'height']);
  }

  public loadfromJson(json: JSON): Promise<void> {
    const container = this.divCanvasContainer;

    this.setCanvasSize(container.clientWidth, container.clientHeight);

    return new Promise(
      (resolve, reject): void => {
        this.adjustCanvas(json);
        this.canvas.loadFromJSON(json, this.canvas.renderAll.bind(this.canvas));
        this.canvas.renderAll();
        resolve();
      }
    );
  }

  public adjustCanvas(json: JSON): void {
    const backgroundImage = json['backgroundImage'];

    const container = this.divCanvasContainer;

    const width = json['width'];
    const height = json['height'];

    const canvasWidth = container.clientWidth;
    const canvasHeight = container.clientHeight;

    const canvasAspect = canvasWidth / canvasHeight;
    const imgAspect = width / height;
    let scaleFactor, left;

    if (canvasAspect <= imgAspect) {
      scaleFactor = canvasWidth / width;
      left = 0;
    } else {
      scaleFactor = canvasHeight / height;
      left = -(width * scaleFactor - container.clientWidth) / 2;
    }

    this.left = left;

    backgroundImage['scaleX'] *= scaleFactor;
    backgroundImage['scaleY'] *= scaleFactor;

    this.setCanvasSize(width * scaleFactor, height * scaleFactor);

    const objects = json['objects'];

    for (let i = 0; i < objects.length; i++) {
      objects[i]['left'] *= scaleFactor;
      objects[i]['top'] *= scaleFactor;
      objects[i]['scaleX'] *= scaleFactor;
      objects[i]['scaleY'] *= scaleFactor;
    }
  }

  public exportImageAsDataURL(): string {
    return this.canvas.toDataURL('image/png');
  }

  public selectItem(itemNumber: number): void {
    this.canvas.setActiveObject(this.canvas.item(itemNumber));
  }

  public getIndexOf(activeObject): number {
    return this.canvas.getObjects().indexOf(activeObject);
  }

  private markSelectedObjectsDirty(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        object.set('dirty', true);
      }
    }
  }

  public addSelectionRectangle(): void {
    this.cropRectangle = new fabric.Rect({
      fill: 'transparent',
      originX: 'left',
      originY: 'top',
      stroke: '#ccc',
      strokeDashArray: [2, 2],
      opacity: 1,
      width: 0,
      height: 0
    });

    this.cropRectangle.visible = false;
    this.canvas.add(this.cropRectangle);
  }

  public ajustCropRectangleFromMouse(event: MouseEvent): boolean {

    const x = Math.min(event.offsetX, this.mousePosition.x),
      y = Math.min(event.offsetY, this.mousePosition.y),
      w = Math.abs(event.offsetX - this.mousePosition.x),
      h = Math.abs(event.offsetY - this.mousePosition.y);

    if (!w || !h) {
      return false;
    }

    this.cropRectangle
      .set('top', y)
      .set('left', x)
      .set('width', w)
      .set('height', h);

    this.canvas.renderAll();

    return true;
  }

  public startSelectingCropRectangleFromMouse(event: MouseEvent): void {
    this.cropRectangle.left = event.offsetX;
    this.cropRectangle.top = event.offsetY;
    this.cropRectangle.setCoords();

    this.mousePosition = {x: event.offsetX, y: event.offsetY };

    this.cropRectangle.visible = true;
    this.canvas.bringToFront(this.cropRectangle);
  }

  public cropImage(): void {
    const left = this.cropRectangle.left;
    const top = this.cropRectangle.top;

    const width = this.cropRectangle.width;
    const height = this.cropRectangle.height;

    const container = this.divCanvasContainer;

    const canvasWidth = container.clientWidth;
    const canvasHeight = container.clientHeight;

    const canvasAspect = canvasWidth / canvasHeight;
    const imgAspect = width / height;
    let scaleFactor;

    if (canvasAspect <= imgAspect) {
      scaleFactor = canvasWidth / width;
    } else {
      scaleFactor = canvasHeight / height;
    }

    this.setCanvasSize(width * scaleFactor, height * scaleFactor);

    this.canvas.backgroundImage.scaleX *= scaleFactor;
    this.canvas.backgroundImage.scaleY *= scaleFactor;

    this.canvas.backgroundImage.left -= left;
    this.canvas.backgroundImage.left *= scaleFactor;
    this.canvas.backgroundImage.top -= top - scaleFactor;
    this.canvas.backgroundImage.top *= scaleFactor;

    this.moveAllObjectsInCanvas(-1 * left, -1 * top, scaleFactor);

    this.enableSlection();
    this.cropRectangle.visible = false;

    this.canvas.remove(this.cropRectangle);

    this.canvas.renderAll();
  }

  public enableSlection() {
    this.canvas.selectable = true;
    this.canvas.selection = true;
  }

  public ajustCropRectangle(event): boolean {
    const touch = event.touches[0];

    const rect = event.target.getBoundingClientRect();

    const x = Math.min(touch.clientX - rect.left, this.mousePosition.x),
      y = Math.min(touch.clientY - rect.top, this.mousePosition.y),
      w = Math.abs(touch.clientX - rect.left - this.mousePosition.x),
      h = Math.abs(touch.clientY - rect.top - this.mousePosition.y);

    if (!w || !h) {
      return false;
    }

    this.cropRectangle
      .set('left', x)
      .set('top', y)
      .set('width', w)
      .set('height', h);

    this.canvas.renderAll();

    return true;
  }

  public startSelectingCropRectangle(event): void {
    const touch = event.touches[0];
    const rect = event.target.getBoundingClientRect();

    this.cropRectangle.left = touch.clientX - rect.left;
    this.cropRectangle.top = touch.clientY - rect.top;
    this.cropRectangle.setCoords();

    this.mousePosition = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };

    this.canvas.renderAll();
    this.cropRectangle.visible = true;
    this.canvas.bringToFront(this.cropRectangle);
  }

  public disableSelection() {
    this.canvas.selection = false;
  }

  private moveAllObjectsInCanvas(x: number, y: number, scaleFactor: number): void {
    const objects = this.canvas.getObjects();
    for (const obj of objects) {
      obj.left += x;
      obj.left *= scaleFactor;
      obj.scaleX *= scaleFactor;
      obj.top += y;
      obj.scaleY *= scaleFactor;
      obj.top *= scaleFactor;
      obj.setCoords();
    }
  }

  public groupSelectedObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      const objects = [];

      for (const object of activeObjects) {
        objects.push(object);
      }
      this.deleteSelectedObjects();

      const group = new fabric.Group(objects);
      this.canvas.add(group);
      group.setCoords();

      this.canvas.setActiveObject(group);

      this.canvas.renderAll();
    }
  }

  public setLastPanPosition(event) {
    this.lastPanPosition = new fabric.Point(event.touches[0].clientX, event.touches[0].clientY);
  }

  public panCanvas(event): void {
    const delta = new fabric.Point(
      event.touches[0].clientX - this.lastPanPosition.x,
      event.touches[0].clientY - this.lastPanPosition.y
    );

    this.canvas.relativePan(delta);
    this.preventPanOutsideCanvas();

    this.canvas.renderAll();
    this.setLastPanPosition(event);
  }

  private preventPanOutsideCanvas() {
    const canvasViewPort = this.canvas.viewportTransform;

    const bottomEndPoint = this.canvas.height * (canvasViewPort[0] - 1);
    if (canvasViewPort[5] >= 0 || -bottomEndPoint > canvasViewPort[5]) {
        canvasViewPort[5] = (canvasViewPort[5] >= 0) ? 0 : -bottomEndPoint;
    }

    const rightEndPoint = this.canvas.width * (canvasViewPort[0] - 1);
    if (canvasViewPort[4] >= 0 || -rightEndPoint > canvasViewPort[4]) {
        canvasViewPort[4] = (canvasViewPort[4] >= 0) ? 0 : -rightEndPoint;
    }
  }

  public zoom(event): void {
    if (Math.abs(event.overallVelocity) > 0.005) {
      const point = new fabric.Point(event.center.x, event.center.y);

      let zoom = this.canvas.getZoom();
      zoom = zoom + (event.scale - zoom) / 20;


      if (zoom < 1) {
        zoom = 1;
        this.canvas.zoomToPoint(new fabric.Point(0, 0), zoom);
        this.canvas.absolutePan(new fabric.Point(0, 0));
      } else {
        if (zoom > 10) {
          zoom = 10;
        }
        this.canvas.zoomToPoint(point, zoom);
      }

      this.setFreeDrawingBrushWidthFromZoom(zoom);
      this.canvas.renderAll();
    }
  }

  private setCanvasSize(width: number, height: number) {
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
  }

  public resetZoom() {
    this.canvas.zoomToPoint(new fabric.Point(0, 0), 1);
    this.canvas.absolutePan(new fabric.Point(0, 0));
  }
}
