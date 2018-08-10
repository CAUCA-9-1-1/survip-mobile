import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from "../Base/http.service";
import {MessageToolsProvider} from "../message-tools/message-tools";
import { Geolocation } from '@ionic-native/geolocation';
import ol from "openlayers";

@Injectable()
export class MapLocalizationRepositoryService {

    positionChanged: EventEmitter<any> = new EventEmitter<any>();

    userGeoPosition = {};
    targetPosition={};
    constructor(public http: HttpService,
                private msgTool: MessageToolsProvider,
                private geoLocation: Geolocation) {
    }

    public getUserGeoLocation(): any{
        this.geoLocation.getCurrentPosition()
            .then((resp) => {

                this.userGeoPosition = new ol.geom.Point(ol.proj.transform([resp.coords.longitude, resp.coords.latitude], 'EPSG:4326', 'EPSG:3857'));
                this.positionChanged.emit(this.userGeoPosition);
                return this.userGeoPosition;

            })
            .catch(error =>
            {
                console.log("Error in getUserGeoLocation", error);
                return null;
            });
    }

}