import {Injectable} from '@angular/core';
import {Lane} from '../../models/lane';
import {Observable} from 'rxjs/Observable';
import {ServiceForListInterface} from '../../interfaces/service-for-list.interface';
import {Storage as OfflineStorage} from '@ionic/storage';
import {StringUtilities} from "./string-utilities";

@Injectable()
export class LaneRepositoryProvider implements ServiceForListInterface {
  private _currentIdCity: string;
  private currentCityLanes: Lane[];

  constructor(private storage: OfflineStorage) {
  }

  public async setCurrentIdCity(cityId: string) {
    if (this._currentIdCity != cityId) {
      this._currentIdCity = cityId;
      await this.loadCityLanes();
    }
  }

  public getFilteredLanes(searchTerm: string): Lane[] {
    const searchTermWithoutDiacritics = StringUtilities.removeDiacritics(searchTerm).toUpperCase();
    return this.currentCityLanes.filter((lane) => {
      const laneName = StringUtilities.removeDiacritics(lane.name).toUpperCase();
      return laneName.indexOf(searchTermWithoutDiacritics) !== -1;
    }).filter((lane, index) => index < 30);
  }

  public get(idLane: string): Observable<string> {
    return Observable.of(this.getName(idLane));
  }

  public getName(idLane: string): string {
    if (!idLane) {
      return '';
    } else {
      const lane = this.currentCityLanes.filter(lane => lane.id === idLane)[0];
      if (lane != null) {
        return lane.name;
      } else{
        return '';
      }
    }
  }

  public getList(searchTerm: string, searchFieldName: string): Observable<any[]> {
    return Observable.of(this.getFilteredLanes(searchTerm));
  }

  public getDescriptionById(id: string): Observable<string> {
    return this.get(id);
  }

  private async loadCityLanes() {
    this.currentCityLanes = (await this.storage.get("lane_by_city_" + this._currentIdCity)).data;
  }
}
