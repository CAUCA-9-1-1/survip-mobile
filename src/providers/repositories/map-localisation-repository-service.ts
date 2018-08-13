import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from "../Base/http.service";
import {MessageToolsProvider} from "../message-tools/message-tools";
import { Geolocation } from '@ionic-native/geolocation';
import ol from "openlayers";

@Injectable()
export class MapLocalizationRepositoryService {

    public positionChanged: EventEmitter<any> = new EventEmitter<any>();

    public userGeoPosition = {};
    public targetPosition={};

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

    public setTargetPosition(position){
        this.targetPosition = position;
        this.positionChanged.emit(position);
    }

    public getCoordinatesFromGeometry(position){
        return [position['x'],position['y']];
    }

    public isLocationAuthorized(){
        /*this.diagnostic.isLocationAuthorized()
            .then((result)=>
            {
                this.diagnostic.isLocationEnabled()
                    .then((result)=>{return result as boolean;})
                    .catch(()=>{return false;});
            })
            .catch(()=>{return false;});*/
        return true;
    }

}