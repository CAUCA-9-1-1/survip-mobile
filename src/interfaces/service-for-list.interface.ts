import {Observable} from 'rxjs/Observable';

export interface ServiceForListInterface {
  getList(searchTerm: string, searchFieldName: string): Observable<any[]>;
  getDescriptionById(id: string): Observable<string>;
}
