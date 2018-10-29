import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UUID} from 'angular2-uuid';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {WindowRefService} from '../../providers/Base/window-ref.service';
import {Platform, Slides, ModalController} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {InspectionPictureForWeb} from '../../models/inspection-picture-for-web';
import {PicturesRepositoryProvider} from '../../interfaces/pictures-repository-provider.interface';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'pictures',
    templateUrl: 'pictures.component.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: PicturesComponent, multi: true}
    ]
})
export class PicturesComponent implements ControlValueAccessor {
    @ViewChild('filePicker') inputRef: ElementRef;
    @ViewChild(Slides) slides: Slides;
    @Input() repo: PicturesRepositoryProvider;
    @Input() saveAuto = true;
    @Input() multiPictures = true;
    @Input() height = 'auto';

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
        targetHeight: 800,
    };

    public isLoading = false;
    public idParent: string;
    public isUsingCordova: boolean = false;
    public labels = {};

    get value(): string {
        return this.idParent;
    }

    set value(value: string) {
        if (value != this.idParent && value != '') {
            this.idParent = value;
            this.loadPictures();
        }
        else if (value == '') {
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
        private translateService: TranslateService) {

        this.loadTranslation();
        this.isUsingCordova = this.platform.is('cordova');

    }

    public loadTranslation() {
        this.translateService.get([
            'confirmation', 'photoDeleteQuestion'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public ngOnInit() {
        this.slides.lockSwipes(!this.multiPictures);
        this.slides.setElementStyle('height',this.height);
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
        if (value != this.idParent && value) {
            this.idParent = value;
            this.loadPictures();
        }
        else if (!value) {
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

    public managePicture(pic: string){
        let picture = new InspectionPictureForWeb();
        if(this.multiPictures || this.repo.pictures.length == 0){
            picture = this.addPicture(pic);
        }else {
            picture = this.updatePicture(pic);
        }

        this.slides.update();
        if (this.saveAuto) {
            this.repo.save(picture);
        } else {
            this.repo.picturesChanged.emit(null);
        }
    }

    public addPicture(pic: string) {
        let picture = new InspectionPictureForWeb();
        picture.id = UUID.UUID();
        picture.idParent = this.idParent;
        picture.dataUri = pic;
        picture.modified = true;
        if (this.isUsingCordova) {
            picture.dataUri = 'data:image/jpeg;base64,' + pic;
        }

        this.repo.pictures.push(picture);
        return picture;
    }

    public updatePicture(pic: string){
        this.repo.pictures[0].dataUri = pic;
        if (this.isUsingCordova) {
            this.repo.pictures[0].dataUri = 'data:image/jpeg;base64,' + pic;
        }
        this.repo.pictures[0].sketchJson = '{}';

        return this.repo.pictures[0];
    }

    private selectPictureNative() {
        let options = this.options;
        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        this.getPicture(options);
    }

    public onDeletePhotos() {
        this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['photoDeleteQuestion']).then(canDelete => {
            if (canDelete) {

                let picture = this.repo.pictures[this.slides._activeIndex];

                this.repo.delete(picture.id);

                this.repo.pictures.splice(this.slides._activeIndex, 1);
                this.slides.update();

                if (this.slides._activeIndex > 0) {
                    this.slides.slideTo(this.slides._activeIndex - 1);
                } else {
                    this.slides.slideTo(0);
                }
            }
        });
    }

    public selectPicture(): void {
        if (this.isUsingCordova)
            this.selectPictureNative();
        else
            this.popFileSelector();
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

        if (files.length) {
            reader.addEventListener('load', this.onFileLoaded.bind(this));
            reader.readAsDataURL(files[0]);
        }
    }

    private onFileLoaded(response): void {
        let imageUri: string = response.target.result;
        this.managePicture(imageUri);
    }

    private getPicture(options: CameraOptions) {
        try {
            this.camera.getPicture(options).then((imageData) => {
                this.managePicture(imageData);
            }, (err) => {
                alert(err);
            });
        }
        catch (error) {
            alert(JSON.stringify(error));
        }
    }

    public hasImageUrl(pic: string): boolean {
        return !(pic === "" || pic == null);
    }

    public getImageUrl(pic: string) {
        return pic === "" || pic == null
            ? ''
            : this.sanitizer.bypassSecurityTrustUrl(pic);
    }

    public onEditPhoto() {
        let picture = this.repo.pictures[this.slides._activeIndex];
        let modal = this.modalCtrl.create('BuildingChildPictureEditionPage', {picture: picture, repo: this.repo});
        modal.onDidDismiss(data => {
            this.repo.pictures[this.slides._activeIndex] = data;
            if (data.modified) {
                if (this.saveAuto) {
                    this.repo.save(data);
                }
                else {
                    this.repo.picturesChanged.emit(null);
                }
            }
        });
        modal.present();
    }
}
