import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import ol from "openlayers";
import {MapLocalizationRepositoryService} from "../../providers/repositories/map-localisation-repository-service";

@IonicPage()
@Component({
  selector: 'page-map-localization',
  templateUrl: 'map-localization.html',
})
export class MapLocalizationPage {
    @ViewChild('map') map;

    mapLayer: ol.Map;
    vectorSource: ol.source.Vector;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private mapService: MapLocalizationRepositoryService) {
  }

  private centerMap(){

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
                maxZoom: 18,
                minZoom:6,
                extent: [-8700000, 5600000, -7600000, 6600000]
            })
        });
    }

    private refreshMap() {
        this.mapLayer.updateSize();
    }

}
