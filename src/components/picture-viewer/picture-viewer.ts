import {StatusBar} from '@ionic-native/status-bar';
import {Component, ElementRef, OnDestroy, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {DomSanitizer} from '@angular/platform-browser';
import {Platform} from 'ionic-angular';
import {WindowRefService} from '../../providers/Base/window-ref.service';
import {PictureData} from '../../models/picture-data';

@Component({
  selector: 'picture-viewer',
  templateUrl: 'picture-viewer.html',
  providers:[
    {provide: NG_VALUE_ACCESSOR, useExisting: PictureViewerComponent, multi: true}
  ]
})
export class PictureViewerComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('filePicker') inputRef: ElementRef;

  @Input() public loadedJson: string;
  @Output() public json = new EventEmitter<string>();

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

  private modifiedJson: string;
 
  isUsingCordova: boolean;

  get imageUrl(){
    return this.imageData === "" || this.imageData == null
      ? ''
      //: this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this.imageData);
      : 'data:image/jpeg;base64,' + this.imageData;
  }

  get hasImageUrl(): boolean{
    if (!this.imageData) 
      return false;
    return !(this.imageData === "" || this.imageData == null);
  }

  constructor(
    private camera: Camera,
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
    console.log(response);
    let imageUri: string = response.target.result;
    if (imageUri.indexOf(';base64,') > 0)
        imageUri = imageUri.substr(imageUri.indexOf(';base64,') + 8);
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

  public onJsonChanged(json: string) {
    this.modifiedJson = json;
    this.json.emit(this.modifiedJson);
  }
}
