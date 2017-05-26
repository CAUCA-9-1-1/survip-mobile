import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Lane} from '../../models/lane';

/*
  Generated class for the LaneRepositoryProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LaneRepositoryProvider implements ServiceForListInterface {
  private laneUrl = 'api/lanes';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {

  }

  getList(searchTerm: string, searchFieldName: string): Promise<Lane[]> {
    return this.http.get(this.laneUrl + '?'+searchFieldName+'='+searchTerm)
      .toPromise()
      .then(response => {
        let lanes = response.json().data as Lane[];
        lanes.sort((lane1, lane2) => {
          if (lane1.fullNameForFireCad > lane2.fullNameForFireCad) {
            return 1;
          } else if (lane1.fullNameForFireCad < lane2.fullNameForFireCad) {
            return -1;
          }
          return 0;
        })
        return lanes;
      })
      .catch(this.handleError);
  }

  getDescriptionById(idLane: string): Promise<string> {
    return this.http.get(this.laneUrl + '?idLane=' + idLane)
      .toPromise()
      .then(response => this.getName(response.json().data as Lane[]))
      .catch(this.handleError);
  }

  private getName(lanes: Lane[]): string {
    return lanes[0].fullNameForFireCad;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
