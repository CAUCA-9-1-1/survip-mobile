import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {FirestationForlist} from '../../models/firestation';
import {map} from 'rxjs/operators';

@Injectable()
export class FirestationRepositoryProvider {
  constructor(private http: HttpService){}

  public getList() : Observable<FirestationForlist[]>
  {
    return this.http.get('firestationforlist')
      .pipe(map(response => response));
  }
}
