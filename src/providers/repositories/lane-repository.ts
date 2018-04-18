import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Lane} from '../../models/lane';
import {ServiceForListInterface} from '../../interfaces/service-for-list.interface'
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

@Injectable()
export class LaneRepositoryProvider implements ServiceForListInterface {
  public currentIdCity: string = "";

  constructor(private http: HttpService) {}

  getAll(): Observable<Lane>{
    return this.http.get('citylanes/fr/' + this.currentIdCity)
      .pipe(map(response => response));
  }

  get(idLane: string): Observable<string>{
    if (!idLane) {
      return Observable.of("");
    } else {
      return this.http.get('lanelight/fr/' + idLane)
        .pipe(map(response => response));
    }
  }

  getList(searchTerm: string, searchFieldName: string): Observable<any[]> {
    return this.getAll() as Observable<any>;
  }

  getDescriptionById(id: string): Observable<string> {
    return this.get(id);
  }
}
