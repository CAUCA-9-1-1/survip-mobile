import {InspectionBuildingChildPictureForWeb} from '../models/inspection-building-child-picture-for-web';
import {EventEmitter} from "@angular/core";

export interface BuildingChildPictureRepositoryProvider {
  pictures: InspectionBuildingChildPictureForWeb[];
  picturesChanged: EventEmitter<any>;
  getList(id: string): Promise<InspectionBuildingChildPictureForWeb[]>;
  save(picture: InspectionBuildingChildPictureForWeb): Promise<any>;
  delete(idBuildingAnomalyPicture: string): Promise<any>;
}
