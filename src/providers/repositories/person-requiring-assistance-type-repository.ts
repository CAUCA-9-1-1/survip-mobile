import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {GenericType} from '../../models/generic-type';

@Injectable()
export class PersonRequiringAssistanceTypeRepositoryProvider {

  constructor(public http: HttpService) {
  }

  public getAll(): Observable<GenericType[]> {
    return this.http.get('personrequiringassistancetype')
      .pipe(map(response => response));
  }
}
