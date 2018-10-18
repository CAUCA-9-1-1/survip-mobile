import {InspectionPictureForWeb} from '../models/inspection-picture-for-web';
import {EventEmitter} from "@angular/core";

export interface PicturesRepositoryProvider {
  pictures: InspectionPictureForWeb[];
  picturesChanged: EventEmitter<any>;
  getList(id: string): Promise<InspectionPictureForWeb[]>;
  save(picture: InspectionPictureForWeb): Promise<any>;
  delete(idBuildingAnomalyPicture: string): Promise<any>;
}
