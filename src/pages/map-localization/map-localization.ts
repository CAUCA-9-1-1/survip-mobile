import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import ol from "openlayers";
import {MapLocalizationRepositoryService} from "../../providers/repositories/map-localisation-repository-service";

@IonicPage()
@Component({
    selector: 'page-map-localization',
    templateUrl: 'map-localization.html',
})
export class MapLocalizationPage {
    @ViewChild('map') map;

    public mapLayer: ol.Map;
    public vectorSource: ol.source.Vector;
    public targetLocation: {};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private mapService: MapLocalizationRepositoryService,
                private viewCtrl: ViewController) {
        if (this.navParams.get('position')) {
            this.targetLocation = this.mapService.getCoordinatesFromGeometry(this.navParams.get('position'));
        }
    }

    public ionViewDidLoad() {
        this.loadMap();
        this.centerMap();
    }

    private centerMap() {
        let geometries = new ol.geom.GeometryCollection();
        if (this.targetLocation) {
            geometries.setGeometries([new
            ol.geom.Point(ol.proj.transform([this.targetLocation[0], this.targetLocation[1]], 'EPSG:4326', 'EPSG:3857'))]);
        }
        this.mapLayer.getView().fit(geometries.getExtent());

        this.refreshMap();
    }

    private loadMap() {
        this.vectorSource = new ol.source.Vector({});

        const iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 0.75,
                src: './assets/icon/location.svg'
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
        this.addMapCentroidTarget();
        this.mapLayer.updateSize();
    }

    public getLocalization() {
        this.mapService.setTargetPosition(ol.proj.transform(this.mapLayer.getView().getCenter(), 'EPSG:3857', 'EPSG:4326'));
        this.viewCtrl.dismiss();
    }

}
