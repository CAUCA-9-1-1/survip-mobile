import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from "../Base/http.service";
import {MessageToolsProvider} from "../message-tools/message-tools";
import {Geolocation} from '@ionic-native/geolocation';
import ol from "openlayers";
import {Diagnostic} from "@ionic-native/diagnostic";
import {Platform} from "ionic-angular";
import {CityWithRegion} from "../../models/city-with-region";
import {NativeGeocoder, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";
import {CityRepositoryProvider} from "./city-repository-provider";


@Injectable()
export class MapLocalizationRepositoryService {

    public positionChanged: EventEmitter<any> = new EventEmitter<any>();
    public mapCenterChanged: EventEmitter<any> = new EventEmitter<any>();
    public addressFromCoordinatesUpdated: EventEmitter<any> = new EventEmitter<any>();

    public mapCenterPosition: ol.geom.Geometry;
    public targetPosition: ol.geom.Geometry;

    public buildingPosition: ol.geom.Geometry;
    public selectedCity: CityWithRegion;
    public cityPosition: ol.geom.Geometry;

    constructor(public http: HttpService,
                private msgTool: MessageToolsProvider,
                private geoLocation: Geolocation,
                private diagnostic: Diagnostic,
                private plt: Platform,
                private nativeGeocoder: NativeGeocoder,
                private cityService: CityRepositoryProvider) {
    }

    public getUserPosition() {
        this.geoLocation.getCurrentPosition()
            .then((resp) => {
                this.mapCenterPosition = new ol.geom.Point(ol.proj.transform([resp.coords.longitude, resp.coords.latitude], 'EPSG:4326', 'EPSG:3857'));
                this.mapCenterChanged.emit(this.mapCenterPosition);
            })
            .catch(error => {
                console.log("Error in getUserGeoLocation", error);
                this.getCenterFromBuildingOrCity();
            });

    }

    public getCenterFromBuildingOrCity() {
        if (this.buildingPosition) {
            this.mapCenterPosition = this.buildingPosition;
        } else if (this.cityPosition) {
            this.mapCenterPosition = this.cityPosition;
        }
        this.mapCenterChanged.emit(this.mapCenterPosition);
    }

    public setBuildingPosition(coordinates) {
        this.buildingPosition = new ol.format.WKT().readGeometry(coordinates).transform('EPSG:4326', 'EPSG:3857');
    }

    public setInspectionCity(idCity: string){
        this.cityService.getCity(idCity)
            .subscribe(
                success => {
                this.selectedCity = success;
                this.setCityPosition(this.selectedCity);
            }, error => {
                console.log("Error in setInspectionCity", error);
            })
    }
    public async setCityPosition(city : CityWithRegion) {
        this.selectedCity = city;
        if (this.plt.is('mobileweb') || this.plt.is('core')) {
            this.cityPosition = new ol.geom.Point(ol.proj.transform([-70.6771584, 46.1214952], 'EPSG:3857', 'EPSG:4326'));
            return;
        }
        let coordinates = await this.nativeGeocoder.forwardGeocode(city.name + ', ' + city.regionName);
        this.cityPosition = new ol.geom.Point(ol.proj.transform([parseFloat(coordinates[0]['longitude']), parseFloat(coordinates[0]['latitude'])], 'EPSG:4326', 'EPSG:3857'));
    }

    public getMapCenter() {
        this.getUserPosition();
    }

    public setTargetPosition(geometry) {
        this.targetPosition = geometry;
        this.positionChanged.emit(new ol.format.WKT().writeGeometry(geometry));
        this.getAddressFromGeometry(geometry);
    }

    private getAddressFromGeometry(geometry){

        this.nativeGeocoder.reverseGeocode(geometry['A'][1], geometry['A'][0])
            .then((success: NativeGeocoderReverseResult[]) => {
                this.formatAddressFromLocation(JSON.stringify(success[0]));
            })
            .catch((error: any) => console.log(error));
    }

    private formatAddressFromLocation(locationDetail: string) {
        let address = '';
        try {
            let detail = JSON.parse(locationDetail);
            if (detail) {
                if (detail['subThoroughfare']) {
                    address += detail['subThoroughfare'];
                }
                if (detail['thoroughfare']) {
                    if (address) {
                        address += ' ';
                    }
                    address += detail['thoroughfare'];
                }
                if (detail['postalCode']) {
                    if (address) {
                        address += ', ';
                    }
                    address += detail['postalCode'];
                }
                if (detail['locality']) {
                    if (address) {
                        address += ', ';
                    }
                    address += detail['locality'];
                }
            }
        } catch (e) {
            address = '';
            console.log("Erreur dans le traitement de l'adresse du geocoder : " + e.toString());
        }
        this.addressFromCoordinatesUpdated.emit(address);
    }

    public getGeometry(geometry) {
        if(geometry){
            return  new ol.format.WKT().readGeometry(geometry).transform('EPSG:4326', 'EPSG:3857');
        }
        return null;
    }

    public isLocationAuthorized() {
        if (this.plt.is('mobileweb') || this.plt.is('core')) {
            return true;
        }
        this.diagnostic.isLocationAuthorized()
            .then((result) => {
                this.diagnostic.isLocationEnabled()
                    .then((result) => {
                        return result as boolean;
                    })
                    .catch(() => {
                        return false;
                    });
            })
            .catch((error) => {
                console.log("Error in isLocationAuthorized", error);
                return false;
            });

    }

}