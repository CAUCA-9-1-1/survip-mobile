import {Observable} from 'rxjs/Observable';
import {HttpService} from '../Base/http.service';
import {EventEmitter, Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {InspectionPictureForWeb} from "../../models/inspection-picture-for-web";
import {Platform} from "ionic-angular";
import {InspectionConfigurationProvider} from "../inspection-configuration/inspection-configuration";

@Injectable()
export class PictureRepositoryProvider {
    constructor(private http: HttpService, private platform: Platform, private config: InspectionConfigurationProvider) {
    }

    public pictures: InspectionPictureForWeb[] = [];

    public picturesChanged: EventEmitter<any> = new EventEmitter<any>();

    public getList(idPicture: string): Promise<InspectionPictureForWeb[]> {
        if (!idPicture)
            return Observable.of([]).toPromise();
        else {
            return this.http.get("inspectionpicture/" + idPicture)
                .pipe(map(response => [response])).toPromise();
        }
    }

    public save(picture: InspectionPictureForWeb): Promise<any> {
        return this.http.put("inspectionpicture", JSON.stringify(picture))
            .pipe(map(response => response)).toPromise();
    }

    public delete(idPlan: string){
        return this.http.delete("inspectionpicture/"+idPlan)
            .pipe(map(response => response)).toPromise();
    }

    public async isPictureSizeValid(picUrl: string){
        if (this.platform.is('cordova')) {
            picUrl = 'data:image/jpeg;base64,' + picUrl;
        }
        console.log("getPictureSize");
        var xhr = new XMLHttpRequest();
        xhr.open('GET', picUrl, true);
        xhr.responseType = 'blob';
        const imageBlob = await new Promise((resolve) => {
            xhr.onload = e =>{
                if(xhr.status == 200 && xhr.response.type.startsWith('image/')){
                    console.log("picture : ",xhr.response);
                    if((xhr.response.size / 1000000.0) < this.config.configuration.maxUploadSize) {
                        resolve(true);
                    }else {
                        resolve(false);
                    }
                }else {
                    resolve(false);
                }
            }
            xhr.send();
        });

        return imageBlob;
    }
}
