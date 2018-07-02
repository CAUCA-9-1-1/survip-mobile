import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UUID} from 'angular2-uuid';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {WindowRefService} from '../../providers/Base/window-ref.service';
import {Platform, Slides} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {InspectionBuildingChildPictureForWeb} from '../../models/inspection-building-child-picture-for-web';
import {BuildingChildPictureRepositoryProvider} from '../../interfaces/building-child-picture-repository-provider';


@Component({
    selector: 'building-child-pictures',
    templateUrl: 'building-child-pictures.html',
    providers: [
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
        private sanitizer: DomSanitizer,
        private platform: Platform,
        private windowRef: WindowRefService) {

        this.isUsingCordova = this.platform.is('cordova');
    }

    async ionViewDidLoad() {
    }

    async loadPictures() {
        this.isLoading = true;
        this.pictures = await this.repo.getList(this.idParent);
        this.isLoading = false;
    }

    touch() {
        this.touched.forEach(f => f());
    }

    writeValue(value: string) {
        console.log('write value : ' + value + ' | idParent : ' + this.idParent);
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

    public addPicture(pic: string) {
        let picture = new InspectionBuildingChildPictureForWeb();
        picture.id = UUID.UUID();
        picture.idParent = this.idParent;
        picture.pictureData = pic;
        this.pictures.push(picture);

        this.slides.update();

        this.repo.save(picture);
    }

    private selectPictureNative() {
        let options = this.options;
        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        this.getPicture(options);
    }

    public onDeletePhotos() {
        this.msg.ShowMessageBox("Demande de confirmation", "Êtes-vous sur de vouloir supprimer cette photo?").then(canDelete => {
            if (canDelete) {

                let picture = this.pictures[this.slides._activeIndex];

                this.repo.delete(picture.id);

                this.pictures.splice(this.slides._activeIndex, 1);
                this.slides.update();

                if(this.slides._activeIndex > 0) {
                    this.slides.slideTo(this.slides._activeIndex - 1);
                }else{
                    this.slides.slideTo(0);
                }
            }
        });
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
            // : this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + pic);
            : ('data:image/jpeg;base64,' + pic);
    }

    public onJsonChanged($event) {
        console.log('Should save picture.');
    }
}
