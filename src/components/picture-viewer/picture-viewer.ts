import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {DomSanitizer} from '@angular/platform-browser';
import {Platform} from 'ionic-angular';
import {WindowRefService} from '../../providers/Base/window-ref.service';
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
  @ViewChild('filePicker') inputRef: ElementRef;

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
    private platform: Platform,
    private windowRef: WindowRefService)
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
      this.imageData = value;
      this.changed.forEach(f => f(value));
    }
  }

  touch() {
    this.touched.forEach(f => f());
  }

  writeValue(value: string) {
    if (!this.isDisposed) { // this is a patch to fix an issue where some ghost instance of this component would exist in memory and would be linked to the same formGroup somehow.
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
      this.popFileSelector();
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
      this.photoViewer.show('data:image/jpeg;base64,' + this.imageData, 'Plan d\'implantation'); // this is so not working.
    /*}
    catch(error)
    {
      alert(JSON.stringify(error));
    }*/
  }

  private popFileSelector(): void {
    this.inputRef.nativeElement.click();
  }

  onFileSelected(e: any): void {
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
    let imageUri: string = response.target.result;
    if (imageUri.startsWith('data:image/jpeg;base64,'))
        imageUri = imageUri.replace('data:image/jpeg;base64,', '')
    this.value = imageUri;
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
