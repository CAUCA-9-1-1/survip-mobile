import { Directive, Self, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Feature, FeatureDataSource, MapBrowserComponent, IgoMap, VectorLayer} from 'igo2';
import {InterventionService} from '../../shared/services/repositories.service';
import {RiskLevelService} from '../../shared/services/risk-level.service';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {InterventionRepositoryProvider} from '../../providers/repositories/intervention-repository';

@Directive({
  selector: '[intervention-layer]' // Attribute selector
})
export class InterventionLayerDirective implements OnInit, OnDestroy {
  private component: MapBrowserComponent;
  private interventionSource: ol.source.Vector;
  private features$$: Subscription;
  private format = new ol.format.GeoJSON();

  private fillColors = {};
  private riskCode = {};

  private textStyleOptions = {
    text: 'home',
    font: 'normal 22px Material Icons',
    textBaseline: 'Center'
  };

  get map(): IgoMap {
    return this.component.map;
  }

  constructor(@Self() component?: MapBrowserComponent,
              private interventionService?: InterventionRepositoryProvider,
              private riskLevelService?: RiskLevelRepositoryProvider) {

    if (component) {
      this.component = component;

      this.riskLevelService.getAll().subscribe(levels => {
        levels.forEach(level => {
          this.fillColors[level.idRiskLevel] = level.color;
          this.riskCode[level.idRiskLevel] = level.code;
        });
        console.log(this.fillColors);
        console.log(this.riskCode);
        this.addLayer();
      });
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.features$$.unsubscribe();
  }

  private addLayer() {
    const interventionDataSource = new FeatureDataSource({
      title: 'interventions'
    });

    const interventionLayer = new VectorLayer(interventionDataSource, {
      zIndex: 20
    });

    this.map.addLayer(interventionLayer, false);
    this.interventionSource = interventionDataSource.ol;

    this.features$$ = this.interventionService.features$
      .subscribe(features => this.handleFeatures(features));

    this.map.ol.getViewport().addEventListener('click', (e) => {
      const eventPixel = this.map.ol.getEventPixel(e);

      this.map.ol.forEachFeatureAtPixel(eventPixel, (feature, layer) => {
        this.click(feature);
      });
    });
  }

  private handleFeatures(features: Feature[]) {
    if (this.interventionSource) {
      this.interventionSource.clear();
    }

    if (!features) {
      return;
    }

    features.forEach((feature: Feature) => this.addFeature(feature));
  }

  private addFeature(feature: Feature) {
    const style = this.createFeatureStyle(feature);
    const olFeature = this.format.readFeature(feature, {
      dataProjection: feature.projection,
      featureProjection: this.map.projection
    });

    console.log('feature ou whatever: ', feature);
    olFeature.setStyle(style);
  }

  private createFeatureStyle(feature: Feature): ol.style.Style {
    const cls = feature.properties.idRiskLevel || '-1';
    const fillColor = this.fillColors[cls] || this.fillColors['-1'];

    const style = new ol.style.Style({
      text: new ol.style.Text(Object.assign({
        fill: new ol.style.Fill({
          color: fillColor
        })
      }, this.textStyleOptions))
    });
    console.log(style);
    return style;
  }

  private click(feature) {
    if (feature) {
      const properties = feature.getProperties();

      if (this.riskCode[properties.idRiskLevel] === 3 || this.riskCode[properties.idRiskLevel] === 4) {
        console.log('intervention plan!');
        //this.router.navigate(['/intervention/survey', properties.idInterventionPlan]);
      } else {
        //this.router.navigate(['/prevention/survey', properties.idInspection]);
        console.log('survey!');
      }
    }
  }
}
