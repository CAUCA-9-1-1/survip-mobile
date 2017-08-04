import {Observable} from 'rxjs/Observable';
import {HttpService} from '../Base/http.service';
import {Injectable} from '@angular/core';
import {ResponseContentType} from '@angular/http';

@Injectable()
export class PictureRepositoryProvider{
  constructor(private http: HttpService){}

  getPicture(idPicture: string):Observable<any>{
    if (!idPicture){
      return Observable.create(() => null);
    }
    else {
      return this.http.get("picture/" + idPicture, undefined, true)
        .map((response) => response);
    }
  }
}
