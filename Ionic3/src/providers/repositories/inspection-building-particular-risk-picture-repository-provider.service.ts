import {EventEmitter, Injectable} from '@angular/core';
import {PicturesRepositoryProvider} from '../../interfaces/pictures-repository-provider.interface';
import {InspectionPictureForWeb} from '../../models/inspection-picture-for-web';
import {Storage} from "@ionic/storage";

@Injectable()
export class InspectionBuildingParticularRiskPictureRepositoryProvider implements PicturesRepositoryProvider {
  constructor(private offlineStorage: Storage) {
  }

  public pictures: InspectionPictureForWeb[] = [];
  public picturesChanged: EventEmitter<any> = new EventEmitter<any>();
  public picturesDeleted: EventEmitter<any> = new EventEmitter<any>();

  public async getList(idParent: string): Promise<InspectionPictureForWeb[]> {
    const list = await this.offlineStorage.get('building_particular_risk_pictures_' + idParent);
    if (list == null) {
      return [];
    } else {
      return list;
    }
  }

  public save(idParent: string, pictures: InspectionPictureForWeb[]): Promise<boolean> {
    return this.offlineStorage.set('building_particular_risk_pictures_' + idParent, pictures);
  }

  public delete(idParent: string, idPicture: string): Promise<boolean> {
    const pic = this.pictures.find(p => p.id == idPicture);

    if (pic != null) {
      pic.isActive = false;
      pic.dataUri = null;
      pic.sketchJson = null;
    }

    return this.save(idParent, this.pictures);
  }
}
