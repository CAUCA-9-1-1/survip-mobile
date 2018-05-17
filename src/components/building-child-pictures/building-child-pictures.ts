import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UUID} from 'angular2-uuid';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {WindowRefService} from '../../providers/Base/window-ref.service';
import {Platform, Slides} from 'ionic-angular';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {DomSanitizer} from '@angular/platform-browser';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {InspectionBuildingChildPictureForWeb} from '../../models/inspection-building-child-picture-for-web';
import {BuildingChildPictureRepositoryProvider} from '../../interfaces/building-child-picture-repository-provider';


@Component({
  selector: 'building-child-pictures',
  templateUrl: 'building-child-pictures.html',
  providers:[
    {provide: NG_VALUE_ACCESSOR, useExisting: BuildingChildPicturesComponent, multi: true}
  ]
})
export class BuildingChildPicturesComponent implements ControlValueAccessor {
  @ViewChild('filePicker') inputRef: ElementRef;
  @ViewChild(Slides) slides: Slides;
  @Input() repo: BuildingChildPictureRepositoryProvider;

  private changed = new Array<(value: string) => void>();
  private touched = new Array<() => void>();
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

  public isLoading: boolean = true;
  public idParent: string;
  public isUpdatingSlides: boolean = false;
  public pictures: InspectionBuildingChildPictureForWeb[] = [];
  public isUsingCordova: boolean = false;

  get value(): string {
    return this.idParent;
  }

  set value(value: string) {
    if (value != this.idParent && value != '') {
      this.idParent = value;
      this.loadPictures();
    }
    else if (value == '') {
      this.pictures = [];
    }
  }

  constructor(
    private msg: MessageToolsProvider,
    private camera: Camera,
    private photoViewer: PhotoViewer,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private windowRef: WindowRefService) {

    this.isUsingCordova = this.platform.is('cordova');
  }

  async ionViewDidLoad(){
  }

  async loadPictures(){
    this.isLoading = true;
    this.pictures = await this.repo.getList(this.idParent);
    this.isLoading = false;
  }

  touch() {
    this.touched.forEach(f => f());
  }

  writeValue(value: string) {
    if (value != this.idParent && value != '') {
      this.idParent = value;
      this.loadPictures();
    }
    else if (value == '') {
      this.pictures = [];
    }
  }

  registerOnChange(fn: (value: string) => void) {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

  public addPicture(pic: string){
    this.isUpdatingSlides = true;
    let pictCache = [];
    Object.assign(pictCache, this.pictures);
    this.pictures = [];
    let picture = new InspectionBuildingChildPictureForWeb();
    picture.id = UUID.UUID();
    picture.idParent = this.idParent;
    picture.pictureData = pic;
    pictCache.push(picture);
    this.pictures = pictCache;
    if (pictCache.length > 1)
      this.slides.slideTo(this.slides.length());
    this.repo.save(picture);
    this.isUpdatingSlides = false;
  }

  private selectPictureNative() {
    let options = this.options;
    options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.getPicture(options);
  }

  public async onDeletePhotos(index){
    if (await this.msg.ShowMessageBox("Demande de confirmation", "Êtes-vous sur de vouloir supprimer cette photo?")){
      this.isUpdatingSlides = true;
      let picture =this.pictures[index];
      await this.repo.delete(picture.id);
      this.pictures.splice(index);
      this.isUpdatingSlides = false;
    }
  }

  selectPicture(): void {
    if (this.isUsingCordova)
      this.selectPictureNative();
    else
      this.popFileSelector();
  }

  takeNewPicture(): void {
    let options = this.options;
    options.sourceType = this.camera.PictureSourceType.CAMERA;
    this.getPicture(options);
  }

  onClickPicture(pic: string): void {
    this.photoViewer.show('data:image/jpeg;base64,' + pic, 'Plan d\'implantation'); // this is so not working.
  }

  private popFileSelector(): void {
    this.inputRef.nativeElement.click();
  }

  onFileSelected(e: any): void {
    const files = e.target.files;
    const reader = this.windowRef.nativeClass('FileReader');

    if (files.length) {
      reader.addEventListener('load', this.onFileLoaded.bind(this));
      reader.readAsDataURL(files[0]);
    }
  }

  private onFileLoaded(response): void {
    let imageUri: string = response.target.result;
    if (imageUri.indexOf(';base64,') > 0)
      imageUri = imageUri.substr(imageUri.indexOf(';base64,') + 8);
    this.addPicture(imageUri);
  }

  private getPicture(options: CameraOptions) {
    try {
      this.camera.getPicture(options).then((imageData) => {
        this.addPicture(imageData);
      }, (err) => {
        alert(err);
      });
    }
    catch(error)
    {
      alert(JSON.stringify(error));
    }
  }

  public hasImageUrl(pic: string): boolean{
    return !(pic === "" || pic == null);
  }

  public getImageUrl(pic: string){
    return pic === "" || pic == null
      ? ''
      : this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + pic);
  }
}