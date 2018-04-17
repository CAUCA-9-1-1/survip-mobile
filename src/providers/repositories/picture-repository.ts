import {Observable} from 'rxjs/Observable';
import {HttpService} from '../Base/http.service';
import {Injectable} from '@angular/core';
import {PictureData} from '../../models/picture-data';

@Injectable()
export class PictureRepositoryProvider{
  constructor(private http: HttpService){}

  getPicture(idPicture: string):Observable<PictureData>{
    if (!idPicture)
      return Observable.of(new PictureData());
    else {
      return this.http.get("picture/" + idPicture)
        .map((response) => response.json());
    }
  }

  savePicture(picture: PictureData): Observable<Response> {
    return this.http.put("picture", JSON.stringify(picture))
      .map((response) => response);
  }
}
