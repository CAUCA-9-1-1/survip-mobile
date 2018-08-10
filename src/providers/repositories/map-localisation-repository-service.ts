import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from "../Base/http.service";
import {MessageToolsProvider} from "../message-tools/message-tools";
import { Geolocation } from '@ionic-native/geolocation';
import ol from "openlayers";

@Injectable()
export class MapLocalizationRepositoryService {

    positionChanged: EventEmitter<any> = new EventEmitter<any>();

    geoPosition = {};
    constructor(public http: HttpService,
                private msgTool: MessageToolsProvider,
                private geoLocation: Geolocation) {
    }

    public getUserGeoLocation(): any{
        this.geoLocation.getCurrentPosition()
            .then((resp) => {
                return resp;
            })
            .catch(error =>
            {
                console.log("Error in getUserGeoLocation", error);
                return null;
            });
    }

}