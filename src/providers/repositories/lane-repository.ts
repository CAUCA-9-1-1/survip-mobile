import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Lane} from '../../models/lane';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {ServiceForListInterface} from '../../interfaces/service-for-list.interface';

@Injectable()
export class LaneRepositoryProvider implements ServiceForListInterface {
    public currentIdCity: string;

    constructor(private http: HttpService) {
    }

    public getFilteredLanes(searchTerm: string): Observable<Lane> {
        return this.http.get('lane/city/' + this.currentIdCity + '/Search/' + searchTerm);
    }

    public get(idLane: string): Observable<string> {
        if (!idLane) {
            return Observable.of("");
        } else {
            return this.http.get('lane/localized/' + idLane)
                .pipe(map(response => {
                    console.log(response);
                    return response;
                }));
        }
    }

    public getList(searchTerm: string, searchFieldName: string): Observable<any[]> {
        return this.getFilteredLanes(searchTerm) as Observable<any>;
    }

    public getDescriptionById(id: string): Observable<string> {
        return this.get(id);
    }

    public getCityLanes(): Observable<Lane[]> {
        return this.http.get('lane/city/' + this.currentIdCity);
    }
}
