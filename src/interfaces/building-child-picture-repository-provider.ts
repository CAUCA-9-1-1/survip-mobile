import {InspectionBuildingChildPictureForWeb} from '../models/inspection-building-child-picture-for-web';

export interface BuildingChildPictureRepositoryProvider {
  getList(id: string): Promise<InspectionBuildingChildPictureForWeb[]>;
  save(picture: InspectionBuildingChildPictureForWeb): Promise<any>;
  delete(idBuildingAnomalyPicture: string): Promise<any>;
}
