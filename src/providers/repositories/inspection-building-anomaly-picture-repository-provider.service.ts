import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {InspectionBuildingAnomalyPicture} from '../../models/inspection-building-anomaly-picture';
import {map} from 'rxjs/operators';
import {InspectionBuildingChildPictureForWeb} from '../../models/inspection-building-child-picture-for-web';
import {PicturesRepositoryProvider} from '../../interfaces/pictures-repository-provider.interface'

@Injectable()
export class InspectionBuildingAnomalyPictureRepositoryProvider implements PicturesRepositoryProvider {

    constructor(public http: HttpService) {
    }

    public pictures: InspectionBuildingChildPictureForWeb[] = [];

    public picturesChanged: EventEmitter<any> = new EventEmitter<any>();

    public getList(idBuildingAnomaly: string): Promise<InspectionBuildingChildPictureForWeb[]> {
        return this.http.get('inspection/building/anomaly/' + idBuildingAnomaly + '/picture')
            .pipe(map(response =>
                {
                    let picCollection = [];
                    response.forEach(result => {
                        picCollection.push(Object.assign(new InspectionBuildingChildPictureForWeb(),result));
                    })
                    return picCollection;
                }
            ))
            .toPromise();
    }

    public save(picture: InspectionBuildingChildPictureForWeb): Promise<any> {
        return this.http.post('inspection/building/anomaly/picture/', JSON.stringify(picture))
            .pipe(map(response => response))
            .toPromise();
    }

    public delete(idBuildingAnomalyPicture: string): Promise<any> {
        return this.http.delete('inspection/building/anomaly/picture/' + idBuildingAnomalyPicture)
            .pipe(map(response => response))
            .toPromise();
    }

    public saveAll(){
        let modifiedPic = this.pictures.filter(p=>p.modified == true);
        if(modifiedPic.length > 0) {
            return this.http.post('inspection/building/anomaly/pictures/', JSON.stringify(modifiedPic))
                .pipe(map(response => response))
                .toPromise();
        }
    }
}

