import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Storage as OfflineStorage} from '@ionic/storage';
import { ServiceForListInterface } from 'src/app/shared/interfaces/service-for-list.interface';
import { Lane } from 'src/app/shared/models/lane';
import { StringUtilities } from '../utilities/string-utilities';

@Injectable()
export class LaneRepositoryProvider implements ServiceForListInterface {
  private currentIdCity: string;
  private currentCityLanes: Lane[];

  constructor(private storage: OfflineStorage) {
  }

  public async setCurrentIdCity(cityId: string) {
    if (this.currentIdCity !== cityId) {
      this.currentIdCity = cityId;
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
    return of(this.getName(idLane));
  }

  public getName(idLane: string): string {
    if (!idLane) {
      return '';
    } else {
      const foundLane = this.currentCityLanes.filter(lane => lane.id === idLane)[0];
      if (foundLane != null) {
        return foundLane.name;
      } else {
        return '';
      }
    }
  }

  public getList(searchTerm: string, searchFieldName: string): Observable<any[]> {
    return of(this.getFilteredLanes(searchTerm));
  }

  public getDescriptionById(id: string): Observable<string> {
    return this.get(id);
  }

  private async loadCityLanes() {
    this.currentCityLanes = (await this.storage.get('lane_by_city_' + this.currentIdCity)).data;
  }
}
