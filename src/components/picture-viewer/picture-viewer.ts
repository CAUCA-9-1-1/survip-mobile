import {StatusBar} from '@ionic-native/status-bar';
import {Component, ElementRef, OnDestroy, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Platform, ModalController} from 'ionic-angular';
import {WindowRefService} from '../../providers/Base/window-ref.service';
import {PictureData} from '../../models/picture-data';
import {PictureRepositoryProvider} from '../../providers/repositories/picture-repository';

@Component({
    selector: 'picture-viewer',
    templateUrl: 'picture-viewer.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: PictureViewerComponent, multi: true}
    ]
})
export class PictureViewerComponent implements ControlValueAccessor, OnDestroy {
    @ViewChild('filePicker') inputRef: ElementRef;

  @Input() public loadedJson: string;
  @Output() public json = new EventEmitter<string>();

  private isDisposed: boolean = false;
  private imageData: PictureData;
  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    allowEdit: false,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    targetWidth: 680,
    targetHeight: 680,
  };
  private changed = new Array<(value: PictureData) => void>();
  private touched = new Array<() => void>();
 
  isUsingCordova: boolean;

  get imageUrl(): string {
    if (this.imageData.dataUri !== "" || this.imageData.dataUri !== null) {
      const validUri = (this.imageData.dataUri.indexOf(';base64,') > 0)
      ? this.imageData.dataUri
      : 'data:image/jpeg;base64,' + this.imageData.dataUri;
      return validUri;
    }
    return '';
  }

  get hasImageUrl(): boolean {
    if (!this.imageData) 
      return false;
    return !(this.imageData.dataUri == null || this.imageData.dataUri === "");
  }

  get imageJson(): string {
    return (this.imageData.sketchJson !== null || this.imageData.sketchJson !== "")
    ? this.imageData.sketchJson
    : '';
  }

  constructor(
    private camera: Camera,
    private platform: Platform,
    private windowRef: WindowRefService,
    private modalCtrl: ModalController,
    private repo: PictureRepositoryProvider)
  {
    this.isUsingCordova = this.platform.is('cordova');
  }

    public ngOnDestroy(): void {
        this.isDisposed = true;
    }

  get value(): PictureData {
    return this.imageData;
  }

  set value(value: PictureData) {
    if (this.imageData !== value) {
      this.imageData = value;
      this.changed.forEach(f => f(value));
    }
  }

    public touch() {
        this.touched.forEach(f => f());
    }

  writeValue(value: PictureData) {
    if (!this.isDisposed) { // this is a patch to fix an issue where some ghost instance of this component would exist in memory and would be linked to the same formGroup somehow.
      this.imageData = value;
    }

  registerOnChange(fn: (value: PictureData) => void) {
    this.changed.push(fn);
  }

    public registerOnTouched(fn: () => void) {
        this.touched.push(fn);
    }

    public selectPicture(): void {
        if (this.isUsingCordova)
            this.selectPictureNative();
        else
            this.popFileSelector();
    }

    private selectPictureNative() {
        let options = this.options;
        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        this.getPicture(options);
    }

    public takeNewPicture(): void {
        let options = this.options;
        options.sourceType = this.camera.PictureSourceType.CAMERA;
        this.getPicture(options);
    }

    private popFileSelector(): void {
        this.inputRef.nativeElement.click();
    }

    public onFileSelected(e: any): void {
        const files = e.target.files;
        const reader = this.windowRef.nativeClass('FileReader');

        /*this.dialogService.wait();*/

        if (files.length) {
            reader.addEventListener('load', this.onFileLoaded.bind(this));
            reader.readAsDataURL(files[0]);
        }

        /*this.dialogService.close();*/
    }

    private onFileLoaded(response): void {
        console.log(response);
        let imageUri: string = response.target.result;
        if (imageUri.indexOf(';base64,') > 0)
            imageUri = imageUri.substr(imageUri.indexOf(';base64,') + 8);
        this.value = imageUri;
    }

  private onFileLoaded(response): void {
    let imageUri: string = response.target.result;
    if (imageUri.indexOf(';base64,') > 0)
      imageUri = imageUri.substr(imageUri.indexOf(';base64,') + 8);

    this.value = {id: this.value.id, picture: imageUri, dataUri: imageUri, sketchJson: null}; 
  }

  private getPicture(options: CameraOptions) {
    try {
      this.camera.getPicture(options).then((imageData) => {
        this.value.dataUri = imageData;
      }, (err) => {
        alert(err);
      });
    }
    catch(error)
    {
      alert(JSON.stringify(error));
    }
  }

  public onJsonChanged(json: string) {
    let imageUri = this.value.dataUri;
    if (imageUri.indexOf(';base64,') > 0)
      imageUri = imageUri.substr(imageUri.indexOf(';base64,') + 8);
    this.value = {id: this.value.id, picture:imageUri, dataUri: imageUri, sketchJson: json}; 
  }

  private openImageEditionPage(){
    const picture = {id: this.value.id, picture: this.imageUrl, dataUri: this.imageUrl, sketchJson: this.imageJson}
    console.log(picture);
    let modal = this.modalCtrl.create('InterventionImplantationPlanSketchPage', { picture: picture, repo: this.repo });
    modal.present();
  }
}
