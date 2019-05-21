import {InspectionPictureForWeb} from '../models/inspection-picture-for-web';
import {EventEmitter} from "@angular/core";

export interface PicturesRepositoryProvider {
    pictures: InspectionPictureForWeb[];
    picturesChanged: EventEmitter<any>;
    picturesDeleted: EventEmitter<any>;

    getList(id: string): Promise<InspectionPictureForWeb[]>;

    save(idParent: string, pictures: InspectionPictureForWeb[]): Promise<boolean>;

    delete(idParent: string, idPicture: string): Promise<boolean>;
}
