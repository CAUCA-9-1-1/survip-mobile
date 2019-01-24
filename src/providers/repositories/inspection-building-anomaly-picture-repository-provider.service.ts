import {EventEmitter, Injectable} from '@angular/core';
import {InspectionPictureForWeb} from '../../models/inspection-picture-for-web';
import {PicturesRepositoryProvider} from '../../interfaces/pictures-repository-provider.interface'
import {Storage} from "@ionic/storage";

@Injectable()
export class InspectionBuildingAnomalyPictureRepositoryProvider implements PicturesRepositoryProvider {
  constructor(private offlineStorage: Storage) {
  }


  public pictures: InspectionPictureForWeb[] = [];
  public picturesChanged: EventEmitter<any> = new EventEmitter<any>();
  public picturesDeleted: EventEmitter<any> = new EventEmitter<any>();

  public async getList(idParent: string): Promise<InspectionPictureForWeb[]> {
    const list = await this.offlineStorage.get('building_anomaly_pictures_' + idParent);
    if (list == null) {
      return [];
    } else {
      return list;
    }
  }

  public save(idParent: string, pictures: InspectionPictureForWeb[]): Promise<boolean> {
    return this.offlineStorage.set('building_anomaly_pictures_' + idParent, pictures);
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


  /*public getList(idBuildingAnomaly: string): Promise<InspectionPictureForWeb[]> {
      return this.http.get('inspection/building/anomaly/' + idBuildingAnomaly + '/picture')
          .pipe(map(response => {
                  let picCollection = [];
                  response.forEach(result => {
                      picCollection.push(Object.assign(new InspectionPictureForWeb(), result));
                  })
                  return picCollection;
              }
          ))
          .toPromise();
  }

  public save(picture: InspectionPictureForWeb): Promise<any> {
      return this.http.post('inspection/building/anomaly/picture/', JSON.stringify(picture))
          .pipe(map(response => response))
          .toPromise();
  }

  public delete(idBuildingAnomalyPicture: string): Promise<any> {
      return this.http.delete('inspection/building/anomaly/picture/' + idBuildingAnomalyPicture)
          .pipe(map(response => response))
          .toPromise();

  }*/


}

