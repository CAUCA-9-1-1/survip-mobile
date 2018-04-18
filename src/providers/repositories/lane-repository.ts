import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpService} from '../Base/http.service';
import {Lane} from '../../models/lane';
import {ServiceForListInterface} from '../../interfaces/service-for-list.interface'
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LaneRepositoryProvider implements ServiceForListInterface {
  public currentIdCity: string = "";

  constructor(private http: HttpService) {}

  getAll(): Observable<Lane>{
    return this.http.get('citylanes/fr/' + this.currentIdCity).map((response : Response) => {
      const result = response.json();
      return result.data;
    });
  }

  get(idLane: string): Observable<string>{
    if (!idLane) {
      return Observable.of("");
    } else {
      return this.http.get('lanelight/fr/' + idLane).map((response: Response) => {
        const result = response.json();
        return (result.data as Lane[])[0].name;
      });
    }
  }

  getList(searchTerm: string, searchFieldName: string): Observable<any[]> {
    return this.getAll() as Observable<any>;
  }

  getDescriptionById(id: string): Observable<string> {
    return this.get(id);
  }
}
