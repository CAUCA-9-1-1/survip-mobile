import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class StaticListRepositoryProvider {

    constructor(public http: HttpClient) {
    }

    public getSectorList(): string[] {
        return ['', 'A', 'B', 'C', 'D'];
    }

    public getWallList(): string[] {
        return ['', 'M1', 'M2', 'M3', 'M4', 'S1', 'S2', 'S3', 'S4', 'S5'];
    }
}
