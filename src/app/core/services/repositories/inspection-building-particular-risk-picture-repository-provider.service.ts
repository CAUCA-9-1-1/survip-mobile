import {EventEmitter, Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import { PicturesRepositoryProvider } from 'src/app/shared/interfaces/pictures-repository-provider.interface';
import { InspectionPictureForWeb } from 'src/app/shared/models/inspection-picture-for-web';

@Injectable({providedIn: 'root'})
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
      return list.filter(item => item.isActive !== false);
    }
  }

  public save(idParent: string, pictures: InspectionPictureForWeb[]): Promise<boolean> {
    return this.offlineStorage.set('building_particular_risk_pictures_' + idParent, pictures);
  }

  public delete(idParent: string, idPicture: string): Promise<boolean> {
    const pic = this.pictures.find(p => p.id === idPicture);

    if (pic != null) {
      pic.isActive = false;
      pic.dataUri = null;
      pic.sketchJson = null;
    }

    return this.save(idParent, this.pictures);
  }
}
