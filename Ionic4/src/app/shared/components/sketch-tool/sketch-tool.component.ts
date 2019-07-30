import { Component, OnInit, ViewChild, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController } from '@ionic/angular';
import { CanvasManagerService } from '../../services/canvas-manager.service';
import { AvailableGeometricShape } from '../picture-edition/available-geometric-shape';
import { fabric } from 'fabric';

const Black = '#000000';
const Transparent = 'transparent';

@Component({
  selector: 'app-sketch-tool',
  templateUrl: './sketch-tool.component.html',
  styleUrls: ['./sketch-tool.component.scss'],
})
export class SketchToolComponent implements OnInit, OnChanges {
  @ViewChild('pinchElement') element;

  public fillColor: string;
  public strokeColor: string;
  public isCropping: boolean;
  public isUndoAvailable: boolean;
  public isSelectingColor: boolean;
  public isDrawing: boolean;
  public isPanning: boolean;

  @Input() public imageData: string;
  @Input() public loadedJson: string;
  @Input() public pictogramsPath: string;
  @Input() public pictograms: [string];

  @Output() public canvas = new EventEmitter<fabric.Canvas>();

  private isLoaded: boolean;
  private previousImageData: string;
  private currentJson: JSON;
  private previousJson: JSON;

  private currentImageData: string;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    private canvasManagerService: CanvasManagerService,
    private translate: TranslateService
  ) {
    this.strokeColor = Black;
    this.fillColor = Transparent;
    this.isCropping = false;
    this.isPanning = false;
    this.isLoaded = false;
    this.isUndoAvailable = false;
    this.isSelectingColor = false;
  }

  ngOnInit() {
    if (this.imageData) {
      this.canvasManagerService.emptyCanvas();
      if (this.loadedJson == null || this.loadedJson.length < 10) {
        this.canvasManagerService.setBackgroundFromURL(this.imageData);
      } else {
        this.previousJson = JSON.parse(this.loadedJson);
        this.currentJson = this.previousJson;
        this.canvasManagerService
          .loadfromJson(JSON.parse(this.loadedJson));
      }
      this.isLoaded = true;
      this.previousImageData = this.imageData;
    }
    this.emitCanvas();
  }

  ngOnChanges() {
    if (this.isLoaded) {
      if (this.loadedJson === null || this.loadedJson.length < 10 || this.imageData !== this.previousImageData) {
        this.canvasManagerService.emptyCanvas();
        this.canvasManagerService.setBackgroundFromURL(this.imageData);
        this.previousImageData = this.imageData;
        this.currentJson = null;
      } else if (this.loadedJson !== JSON.stringify(this.currentJson)) {
          this.previousJson = JSON.parse(this.loadedJson);
          this.currentJson = this.previousJson;
          this.canvasManagerService
            .loadfromJson(JSON.parse(this.loadedJson));
      }
    }
    this.emitCanvas();
  }

  get hasPictograms(): boolean {
    return !(!this.pictograms);
  }

  public addText() {
    this.disableAllStates();
    this.canvasManagerService.addText(this.strokeColor, 'text ');
    this.emitCanvas();
  }

  public addShape(shape: string) {
    this.disableAllStates();
    this.canvasManagerService.addGeometricShape(
      this.strokeColor,
      this.fillColor,
      AvailableGeometricShape[shape]
    );
    this.emitCanvas();
  }

  public addImage(source: string) {
    this.disableAllStates();
    this.canvasManagerService.addImage(this.pictogramsPath + source);
    this.emitCanvas();
  }

  public changeStrokeColor() {
    this.canvasManagerService.changeSelectedObjectsStrokeColor(
      this.strokeColor
    );
    this.canvasManagerService.setFreeDrawingBrushColor(this.strokeColor);
    this.emitCanvas();
  }

  public bringFoward() {
    this.disableAllStates();
    this.canvasManagerService.bringSelectedObjectsToFront();
    this.emitCanvas();
  }

  public sendToBack() {
    this.disableAllStates();
    this.canvasManagerService.sendSelectedObjectsToBack();
    this.emitCanvas();
  }

  public crop() {
    if (this.isCropping) {
      this.disableCroppping();
    } else {
      this.disableAllStates();
      this.isCropping = true;
      this.canvasManagerService.resetZoom();
      this.canvasManagerService.disableSelection();
      this.canvasManagerService.addSelectionRectangle();
      this.isUndoAvailable = true;
      this.previousJson = this.canvasManagerService.jsonFromCanvas();
      this.emitCanvas();
    }
  }

  private disableCroppping() {
    this.isCropping = false;
    this.canvasManagerService.enableSlection();
    this.isUndoAvailable = false;
  }

  public deleteSelection() {
    this.disableAllStates();
    this.canvasManagerService.deleteSelectedObjects();
    this.emitCanvas();
  }

  public mouseUp() {
    if (this.isCropping) {
      this.isCropping = false;
      this.canvasManagerService.cropImage();
      this.isUndoAvailable = true;
      this.emitCanvas();
    }
  }

  public mouseMove(event) {
    if (this.isCropping) {
      this.canvasManagerService.ajustCropRectangle(event);
    } else if (this.isPanning) {
        this.canvasManagerService.panCanvas(event);
    }
  }

  public mouseDown(event) {
    if (this.isCropping) {
      this.canvasManagerService.startSelectingCropRectangle(event);
    } else if (this.isPanning) {
        this.canvasManagerService.setLastPanPosition(event);
    }
  }

  public pinch(event) {
    event.preventDefault();
    this.disableDrawing();
    this.canvasManagerService.zoom(event);
  }

  public group() {
    this.disableAllStates();
    this.canvasManagerService.groupSelectedObjects();
    this.emitCanvas();
  }

  public undo() {
    this.canvasManagerService.loadfromJson(this.previousJson);
    this.isUndoAvailable = false;
    this.emitCanvas();
  }

  public onColorClicked() {
    this.isSelectingColor = true;
    this.stopPanning();
  }

  public onMoveClicked() {
    this.isPanning = !this.isPanning;
    this.disableDrawing();
    if (this.isPanning) {
      this.canvasManagerService.disableSelection();
    } else {
      this.canvasManagerService.enableSlection();
    }
  }

  private disablePanning() {
    this.isPanning = false;
    this.canvasManagerService.enableSlection();
  }

  private disableAllStates() {
    this.disableDrawing();
    this.disablePanning();
  }

  public stopPanning() {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvasManagerService.enableSlection();
    }
  }

  public setColor(color: string) {
    this.strokeColor = color;
    this.changeStrokeColor();
    this.isSelectingColor = false;
    this.emitCanvas();
  }

  public draw() {
    this.isDrawing = !this.isDrawing;
    this.canvasManagerService.toggleFreeDrawing();
    this.canvasManagerService.setFreeDrawingBrushColor(this.strokeColor);

    if (this.isDrawing) {
      this.isPanning = false;
    }
  }

  private disableDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.canvasManagerService.toggleFreeDrawing();
    }
  }

  private translateShapeButtonsText(): Array<string> {
    const translationArray = [];
    translationArray.push(this.translate.instant('rectangle'));
    translationArray.push(this.translate.instant('triangle'));
    translationArray.push(this.translate.instant('circle'));
    translationArray.push(this.translate.instant('line'));
    translationArray.push(this.translate.instant('cross'));
    translationArray.push(this.translate.instant('text'));
    return translationArray;
  }

  public async presentShapeActionSheet() {
    this.disableDrawing();

    const titleText = this.translate.instant('addGeometricShape');
    const buttonsText = this.translateShapeButtonsText();
    let i = 0;

    const actionSheet = await this.actionSheetCtrl.create({
      header: titleText,
      mode: 'ios',
      buttons: [
        {
          text: buttonsText[i++],
          icon: 'square',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Rectangle
            );
          }
        },
        {
          text: buttonsText[i++],
          icon: 'arrow-dropup',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Triangle
            );
          }
        },
        {
          text: buttonsText[i++],
          icon: 'radio-button-off',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Circle
            );
          }
        },
        {
          text: buttonsText[i++],
          icon: 'remove',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Line
            );
          }
        },
        {
          text: buttonsText[i++],
          icon: 'add',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Cross
            );
          }
        },
        {
          text: buttonsText[i++],
          icon: 'text',
          handler: () => {
            this.canvasManagerService.addText(this.strokeColor, '');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  private translateEditButtonsText(): Array<string> {
    const translationArray = [];
    translationArray.push(this.translate.instant('crop'));
    translationArray.push(this.translate.instant('group'));
    translationArray.push(this.translate.instant('bringToFront'));
    translationArray.push(this.translate.instant('sendToBack'));
    translationArray.push(this.translate.instant('delete'));
    return translationArray;
  }

  public async presentEditActionSheet() {
    this.disableDrawing();

    const titleText = this.translate.instant('edition');

    const buttonsText = this.translateEditButtonsText();
    let i = 0;

    const actionSheet = await this.actionSheetCtrl.create({
      header: titleText,
      mode: 'ios',
      buttons: [
        {
          icon: 'crop',
          text: buttonsText[i++],
          handler: () => {
            this.crop();
          }
        },
        {
          icon: 'albums',
          text: buttonsText[i++],
          handler: () => {
            this.group();
          }
        },
        {
          text: buttonsText[i++],
          handler: () => {
            this.bringFoward();
          }
        },
        {
          text: buttonsText[i++],
          handler: () => {
            this.sendToBack();
          }
        },
        {
          icon: 'trash',
          text: buttonsText[i++],
          handler: () => {
            this.deleteSelection();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  public async presentPictogramsActionSheet() {
    this.disableDrawing();

    const buttons = [];
    const actionSheetStyles = [];
    const images = this.pictograms;
    for (let i = 0; i < images.length; i++) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML =
        '.customCSSClass' +
        i +
        '{background: url(' +
        '\'' +
        this.pictogramsPath +
        images[i] +
        '\'' +
        ') no-repeat !important;padding-left:50px !important;height:80px; background-position: left center !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);
      actionSheetStyles.push(style);
      buttons.push({
        role: 'destructive',
        text: images[i],
        cssClass: 'customCSSClass' + i,
        handler: () => {
          this.addImage(images[i]);
        }
      });
    }

    const titleText = this.translate.instant('addPictogram');

    const actionSheet = await this.actionSheetCtrl.create({
      header: titleText,
      buttons
    });
    actionSheet.onDidDismiss().then(() => {
      for (let i = 0; i < actionSheetStyles.length; i++) {
        if (actionSheetStyles[i].parentNode != null) {
          actionSheetStyles[i].parentNode.removeChild(actionSheetStyles[i]);
        }
      }
    });

    await actionSheet.present();
  }

  public emitCanvas() {
    this.canvas.emit(this.canvasManagerService.canvas);
  }

}
