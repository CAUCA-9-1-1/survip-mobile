import {Observable} from 'rxjs/Observable';
import {HttpService} from '../Base/http.service';
import {EventEmitter, Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {InspectionPictureForWeb} from "../../models/inspection-picture-for-web";

@Injectable()
export class PictureRepositoryProvider {
    constructor(private http: HttpService) {
    }

    public pictures: InspectionPictureForWeb[] = [];

    public picturesChanged: EventEmitter<any> = new EventEmitter<any>();

    public getList(idPicture: string): Promise<InspectionPictureForWeb[]> {
        if (!idPicture)
            return Observable.of([]).toPromise();
        else {
            return this.http.get("inspectionpicture/" + idPicture)
                .pipe(map(response => response)).toPromise();
        }
    }

    public save(picture: InspectionPictureForWeb): Promise<any> {
        return this.http.put("inspectionpicture", JSON.stringify(picture))
            .pipe(map(response => response)).toPromise();
    }

    public delete(idPlan: string){

    }
}
