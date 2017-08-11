import {Component, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {DomSanitizer} from '@angular/platform-browser';
import {Platform} from 'ionic-angular';
/**
 * Generated class for the PictureComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'picture-viewer',
  templateUrl: 'picture-viewer.html',
  providers:[
    {provide: NG_VALUE_ACCESSOR, useExisting: PictureViewerComponent, multi: true}
  ]
})
export class PictureViewerComponent implements ControlValueAccessor, OnDestroy {
  private isDisposed: boolean = false;
  private imageData: string;
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
  private changed = new Array<(value: string) => void>();
  private touched = new Array<() => void>();

  isUsingCordova: boolean;

  get imageUrl(){
    return this.imageData === "" || this.imageData == null
      ? ''
      : this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this.imageData);
  }

  get hasImageUrl(): boolean{
    return !(this.imageData === "" || this.imageData == null);
  }

  constructor(
    private camera: Camera,
    private photoViewer: PhotoViewer,
    private sanitizer: DomSanitizer,
    private platform: Platform)
  {
    this.isUsingCordova = this.platform.is('cordova');
  }

  ngOnDestroy(): void {
    this.isDisposed = true;
  }

  get value(): string {
    return this.imageData;
  }

  set value(value: string) {
    if (this.imageData !== value) {
      console.log('value changed');
      this.imageData = value;
      this.changed.forEach(f => f(value));
    }
  }

  touch() {
    this.touched.forEach(f => f());
  }

  writeValue(value: string) {
    if (!this.isDisposed) { // this is a patch to fix an issue where some ghost instance of this component would exist in memory and would be linked to the same formGroup somehow.
      console.log('write value');
      this.imageData = value;
    }
  }

  registerOnChange(fn: (value: string) => void) {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

  selectPicture(): void {
    if (this.isUsingCordova)
      this.selectPictureNative();
    else
      console.log("no can do without cordova");
  }

  private selectPictureNative() {
    let options = this.options;
    options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.getPicture(options);
  }

  takeNewPicture(): void {
    let options = this.options;
    options.sourceType = this.camera.PictureSourceType.CAMERA;
    this.getPicture(options);
  }

  onClickPicture(): void {
    /*try {*/
      console.log('click picture');
      this.photoViewer.show('data:image/jpeg;base64,' + this.imageData, 'Plan d\'implantation'); // this is so not working.
    /*}
    catch(error)
    {
      alert(JSON.stringify(error));
    }*/
  }

  private getPicture(options: CameraOptions) {
    try {

      this.camera.getPicture(options).then((imageData) => {
        this.value = imageData;
      }, (err) => {
        alert(err);
      });
    }
    catch(error)
    {
      alert(JSON.stringify(error));
    }
  }
}
