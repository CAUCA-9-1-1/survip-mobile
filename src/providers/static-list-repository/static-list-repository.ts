import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class StaticListRepositoryProvider {

    constructor(public http: HttpClient) {
    }

    getSectorList(): string[] {
        return ['A', 'B', 'C', 'D'];
    }

    getWallList(): string[] {
        return ['M1', 'M2', 'M3', 'M4', 'S1', 'S2', 'S3', 'S4', 'S5'];
    }
}
