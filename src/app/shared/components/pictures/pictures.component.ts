import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PicturesRepositoryProvider } from '../../interfaces/pictures-repository-provider.interface';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform, ModalController, IonSlides } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PictureUtilitiesProvider } from 'src/app/core/services/utilities/picture-utilities/picture-utilities';
import { InspectionPictureForWeb } from '../../models/inspection-picture-for-web';
import { UUID } from 'angular2-UUID';
import { WindowRefService } from 'src/app/core/services/utilities/window-ref.service';
import { PictureEditionComponent } from '../picture-edition/picture-edition.component';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: PicturesComponent, multi: true }
  ],
})
export class PicturesComponent implements OnInit {
  @ViewChild('filePicker', { static: true }) inputRef: ElementRef;
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  @Input() repo: PicturesRepositoryProvider;
  @Input() saveAuto = true;
  @Input() multiPictures = true;
  @Input() height = 'auto';

  public showSlides: boolean = false;

  private changed = new Array<(value: string) => void>();
  private touched = new Array<() => void>();
  private options: CameraOptions = {
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    allowEdit: false,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };

  public isLoading = false;
  public idParent: string;
  public isUsingCordova: boolean = false;
  public labels = {};

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  get value(): string {
    return this.idParent;
  }

  set value(value: string) {
    if (value !== this.idParent && value !== '') {
      this.idParent = value;
      this.loadPictures();
    } else if (value === '') {
      this.repo.pictures = [];
    }
  }

  constructor(
    private msg: MessageToolsProvider,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private windowRef: WindowRefService,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private pictureUtilities: PictureUtilitiesProvider
  ) {
    this.loadTranslation();
    this.isUsingCordova = this.platform.is('cordova');
  }

  public loadTranslation() {
    this.translateService.get([
      'confirmation', 'photoDeleteQuestion', 'imageSizeWarning'
    ]).subscribe(labels => {
      this.labels = labels;
    },
      error => {
        console.log(error);
      });
  }

  public ngOnInit() {
    setTimeout(() => {
      this.showSlides = true;
      }, 0);

    if (this.slides != null) {
      this.slides.lockSwipes(!this.multiPictures);
    }
    // this.slides.setElementStyle('height', this.height);
  }

  public async loadPictures() {
    this.isLoading = true;
    this.repo.pictures = await this.repo.getList(this.idParent);
    this.isLoading = false;
  }

  public touch() {
    this.touched.forEach(f => f());
  }

  public writeValue(value: string) {
    if (value !== this.idParent && value) {
      this.idParent = value;
      this.loadPictures();
    } else if (!value) {
      this.repo.pictures = [];
      this.isLoading = false;
    }
  }

  public registerOnChange(fn: (value: string) => void) {
    this.changed.push(fn);
  }

  public registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

  public async managePicture(pic: string) {
    const picSizeValid = await this.isPictureSizeValid(pic);
    if (picSizeValid) {

      let picture = new InspectionPictureForWeb();
      if (this.multiPictures || this.repo.pictures.length === 0) {
        picture = this.addPicture(pic);
      } else {
        picture = this.updatePicture(pic);
      }

      this.slides.update();
      if (this.saveAuto) {
        await this.repo.save(this.idParent, this.repo.pictures);
      } else {
        this.repo.picturesChanged.emit(null);
      }
      await this.slideToLast();
    } else {
      this.msg.showToast(this.labels['imageSizeWarning']);
    }
  }

  private slideToLast = async () => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    const length = await this.slides.length();
    this.slides.slideTo(length - 1);
  }

  public addPicture(pic: string) {
    const picture = new InspectionPictureForWeb();
    picture.id = UUID.UUID();
    picture.idParent = this.idParent;
    picture.dataUri = pic;
    picture.modified = true;
    picture.hasBeenModified = true;
    if (this.isUsingCordova) {
      picture.dataUri = 'data:image/jpeg;base64,' + pic;
    }

    this.repo.pictures.push(picture);
    return picture;
  }

  public updatePicture(pic: string) {
    this.repo.pictures[0].dataUri = pic;
    if (this.isUsingCordova) {
      this.repo.pictures[0].dataUri = 'data:image/jpeg;base64,' + pic;
    }
    this.repo.pictures[0].sketchJson = '{}';

    return this.repo.pictures[0];
  }

  private selectPictureNative() {
    const options = this.options;
    options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.getPicture(options);
  }

  public onDeletePhotos(idPicture: string) {
    this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['photoDeleteQuestion']).then(async (canDelete) => {
      if (canDelete) {
        this.repo.delete(this.idParent, idPicture);
        let currentIndex = await this.slides.getActiveIndex();

        this.repo.pictures.splice(currentIndex, 1);
        this.slides.update();
        currentIndex = await this.slides.getActiveIndex();

        if (currentIndex > 0) {
          this.slides.slideTo(currentIndex - 1);
        } else {
          this.slides.slideTo(0);
        }

        this.repo.picturesDeleted.emit();
      }
    });
  }

  public selectPicture(): void {
    if (this.isUsingCordova) {
      this.selectPictureNative();
    } else {
      this.popFileSelector();
    }
  }

  public takeNewPicture(): void {
    const options = this.options;
    options.sourceType = this.camera.PictureSourceType.CAMERA;
    this.getPicture(options);
  }

  private popFileSelector(): void {
    this.inputRef.nativeElement.click();
  }

  public onFileSelected(e: any): void {
    const files = e.target.files;
    const reader = this.windowRef.nativeClass('FileReader');

    if (files.length) {
      reader.addEventListener('load', this.onFileLoaded.bind(this));
      reader.readAsDataURL(files[0]);
    }
  }

  private onFileLoaded(response): void {
    const imageUri: string = response.target.result;
    this.managePicture(imageUri);
  }

  private getPicture(options: CameraOptions) {
    try {
      this.camera.getPicture(options).then((imageData) => {
        this.managePicture(imageData);
      }, (err) => {
        console.log(err);
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  public hasImageUrl(pic: string): boolean {
    return !(pic === '' || pic == null);
  }

  public getImageUrl(pic: string) {
    return pic === '' || pic == null
      ? ''
      : this.sanitizer.bypassSecurityTrustUrl(pic);
  }

  public async onEditPhoto() {
    const currentIndex = await this.slides.getActiveIndex();
    const picture = this.repo.pictures[currentIndex];
    const modal = await this.modalCtrl.create({
      component: PictureEditionComponent,
      componentProps: { picture, repo: this.repo }
    });
    modal.present();
    const returnedValue = await modal.onDidDismiss();

    this.repo.pictures[currentIndex] = returnedValue.data;
    if (returnedValue.data.modified) {
      if (this.saveAuto) {
        this.repo.save(this.idParent, this.repo.pictures);
      } else {
        this.repo.picturesChanged.emit(null);
      }
    }
  }

  private async isPictureSizeValid(pic: string) {
    return this.pictureUtilities.pictureSizeIsValid(pic);
  }
}
