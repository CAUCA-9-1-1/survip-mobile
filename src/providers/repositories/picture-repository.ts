import {Observable} from 'rxjs/Observable';
import {HttpService} from '../Base/http.service';
import {Injectable} from '@angular/core';
import {PictureData} from '../../models/picture-data';
import {map} from 'rxjs/operators';

@Injectable()
export class PictureRepositoryProvider {
    constructor(private http: HttpService) {
    }

    public getPicture(idPicture: string): Observable<PictureData> {
        if (!idPicture)
            return Observable.of(new PictureData());
        else {
            return this.http.get("inspectionpicture/" + idPicture)
                .pipe(map(response => response));
        }
    }

    public savePicture(picture: PictureData): Promise<string> {
        return this.http.put("inspectionpicture", JSON.stringify(picture))
            .pipe(map(response => response)).toPromise<string>();
    }
}
