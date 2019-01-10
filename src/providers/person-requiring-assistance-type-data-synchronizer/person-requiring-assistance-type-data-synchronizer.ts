import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {GenericType} from "../../models/generic-type";
import {BaseExpiringDataSynchronizerProvider} from "../base-expiring-data-synchronizer-provider";

@Injectable()
export class PersonRequiringAssistanceTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<GenericType[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'person_requiring_assistance_type', 'personrequiringassistancetype/localized');
  }
}
