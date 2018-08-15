import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import ol from "openlayers";
import {MapLocalizationRepositoryService} from "../../providers/repositories/map-localisation-repository-service";
import {ISubscription} from "../../../node_modules/rxjs/Subscription";

@IonicPage()
@Component({
    selector: 'page-map-localization',
    templateUrl: 'map-localization.html',
})
export class MapLocalizationPage {
    @ViewChild('map') map;

    public mapLayer: ol.Map;
    public vectorSource: ol.source.Vector;
    public fireHydrantLocation: ol.geom.Geometry = null;
    public getLocation = false;
    private subscriber :ISubscription;
    private setPinpoint = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private mapService: MapLocalizationRepositoryService,
                private viewCtrl: ViewController) {
        this.getLocation = this.navParams.get('getLocation') as boolean;
        this.subscriber = this.mapService.mapCenterChanged.subscribe((geometry) => this.mapCenterChanged(geometry));
        if (this.navParams.get('position')) {
            this.fireHydrantLocation = this.navParams.get('position');
            this.setPinpoint = true;
            this.fireHydrantLocation = this.mapService.getGeometry(this.fireHydrantLocation);
        }
    }

    public ionViewDidLoad() {
        this.loadMap();
        if(this.fireHydrantLocation) {
            this.centerMap();
        }else{
            this.mapService.getMapCenter();
        }
    }

    private mapCenterChanged(geometry){
        this.fireHydrantLocation = geometry;
        this.centerMap();
    }

    private centerMap() {
        if (this.fireHydrantLocation) {
            this.mapLayer.getView().fit(this.fireHydrantLocation.getExtent());
        }

        this.refreshMap();
    }

    private loadMap() {
        this.vectorSource = new ol.source.Vector({});

        const iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.75,
                src: './assets/icon/fire-hydrant.svg'
            }))
        });

        const vectorLayer = new ol.layer.Vector({
            source: this.vectorSource,
            style: iconStyle
        });

        this.mapLayer = new ol.Map({
            layers: [new ol.layer.Tile({source: new ol.source.OSM()}), vectorLayer],
            target: document.getElementById('map'),
            view: new ol.View({
                maxZoom: 19,
                minZoom: 6,
                extent: [-8700000, 5600000, -7600000, 6600000]
            })
        });
    }

    private addMapCentroidTarget() {
        const custom_element = document.createElement('div');
        custom_element.id = 'center';

        this.mapLayer.addControl(new ol.control.Control({
            element: custom_element,
            target: document.querySelector('.ol-viewport')
        }));
    }

    private refreshMap() {
        if(this.getLocation) {
            this.addMapCentroidTarget();
        }
        if(this.setPinpoint){
            this.pinPointFireHydrant();
        }
        this.mapLayer.updateSize();
    }

    public getLocalization() {
        this.mapService.setTargetPosition(new ol.geom.Point(ol.proj.transform(this.mapLayer.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')));
        this.viewCtrl.dismiss();
    }

    private pinPointFireHydrant() {

        this.vectorSource.clear();

            const iconFeature = new ol.Feature({
                geometry: this.fireHydrantLocation,
                name: 'fireHydrant ' + 0
            });
            this.vectorSource.addFeature(iconFeature);

    }
}
