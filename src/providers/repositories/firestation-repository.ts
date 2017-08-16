import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {FirestationForlist} from '../../models/firestation';

@Injectable()
export class FirestationRepositoryProvider {
  constructor(private http: HttpService){}

  public getList() : Observable<FirestationForlist[]>
  {
    return this.http.get('firestationforlist').map((response: Response) => {
      const result = response.json();
      return result.data;
    });
  }
}
