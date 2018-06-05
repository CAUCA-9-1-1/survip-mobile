import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RiskLevelRepositoryProvider } from '../providers/repositories/risk-level-repository';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LaneRepositoryProvider } from '../providers/repositories/lane-repository';
import {RequestLoaderService} from '../providers/Base/request-loader.service';
import {HttpService} from '../providers/Base/http.service';
import {PictureRepositoryProvider} from '../providers/repositories/picture-repository';
import {ComponentsModule} from '../components/components.module';
import {FormsModule} from '@angular/forms';
import {RouteDirectionRepositoryProvider} from '../providers/repositories/route-direction-repository';
import {CommonModule} from '@angular/common';
import {InspectionMapPage} from '../pages/inspection-map/inspection-map';
import {AuthenticationService} from '../providers/Base/authentification.service';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {UtilisationCodeRepositoryProvider} from '../providers/repositories/utilisation-code-repository';
import {InspectionBuildingCourseLaneRepositoryProvider} from '../providers/repositories/inspection-building-course-lane-repository-provider.service';
import {InspectionBuildingFireHydrantRepositoryProvider} from '../providers/repositories/inspection-building-fire-hydrant-repository-provider';
import {InspectionBuildingCourseRepositoryProvider} from '../providers/repositories/inspection-building-course-repository';
import {InspectionBuildingsRepositoryProvider} from '../providers/repositories/inspection-buildings-repository-provider.service';
import {InspectionDetailRepositoryProvider} from '../providers/repositories/inspection-detail-repository-provider.service';
import {InspectionControllerProvider} from '../providers/inspection-controller/inspection-controller';
import {InspectionRepositoryProvider} from '../providers/repositories/inspection-repository-provider.service';
import {FirestationRepositoryProvider} from '../providers/repositories/firestation-repository-provider.service';
import { MessageToolsProvider } from '../providers/message-tools/message-tools';
import {BuildingFireHydrantRepositoryProvider} from "../providers/repositories/building-fire-hydrant-repository";
import { BuildingContactRepositoryProvider } from '../providers/repositories/building-contact-repository';
import { ConstructionTypesRepositoryProvider } from '../providers/repositories/construction-types-repository';
import { UnitOfMeasureRepositoryProvider } from '../providers/repositories/unit-of-measure-repository';
import { BuildingDetailRepositoryProvider } from '../providers/repositories/building-detail-repository';
import {InspectionQuestionRepositoryProvider} from "../providers/repositories/inspection-question-repository-provider";
import { InspectionBuildingHazardousMaterialRepositoryProvider } from '../providers/repositories/inspection-building-hazardous-material-repository';
import { HazardousMaterialRepositoryProvider } from '../providers/repositories/hazardous-material-repository';
import { PersonRequiringAssistanceTypeRepositoryProvider } from '../providers/repositories/person-requiring-assistance-type-repository';
import { InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider } from '../providers/repositories/inspection-building-person-requiring-assistance-type-repository';
import { StaticListRepositoryProvider } from '../providers/static-list-repository/static-list-repository';
import {InspectionBuildingSprinklerRepositoryProvider} from '../providers/repositories/inspection-building-sprinkler-repository-provider.service';
import {InspectionBuildingAlarmPanelRepositoryProvider} from '../providers/repositories/inspection-building-alarm-panel-repository-provider.service';
import {AlarmPanelTypeRepository} from '../providers/repositories/alarm-panel-type-repository.service';
import {SprinklerTypeRepository} from '../providers/repositories/sprinkler-type-repository.service';
import {InspectionBuildingAnomalyRepositoryProvider} from '../providers/repositories/inspection-building-anomaly-repository-provider.service';
import {InspectionBuildingAnomalyPictureRepositoryProvider} from '../providers/repositories/inspection-building-anomaly-picture-repository-provider.service';
import {InspectionBuildingParticularRiskPictureRepositoryProvider} from '../providers/repositories/inspection-building-particular-risk-picture-repository-provider.service';
import {InspectionBuildingParticularRiskRepositoryProvider} from '../providers/repositories/inspection-building-particular-risk-repository-provider.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function httpServiceFactory(
  client: HttpClient
) {
  return new HttpService(client);
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    //InspectionMapPageModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CommonModule,
    IonicModule.forRoot(MyApp),
    BrowserModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  exports: [
  ],
  providers: [
    InspectionMapPage,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PictureRepositoryProvider,
    RiskLevelRepositoryProvider,
    InspectionControllerProvider,
    LaneRepositoryProvider,
    InspectionRepositoryProvider,
    InspectionDetailRepositoryProvider,
    InspectionBuildingsRepositoryProvider,
    InspectionBuildingCourseRepositoryProvider,
    InspectionBuildingCourseLaneRepositoryProvider,
    InspectionBuildingFireHydrantRepositoryProvider,
    InspectionBuildingSprinklerRepositoryProvider,
    InspectionBuildingAlarmPanelRepositoryProvider,
    InspectionBuildingAnomalyRepositoryProvider,
    InspectionBuildingAnomalyPictureRepositoryProvider,
    InspectionBuildingParticularRiskPictureRepositoryProvider,
    InspectionBuildingParticularRiskRepositoryProvider,
    AlarmPanelTypeRepository,
    SprinklerTypeRepository,
    FirestationRepositoryProvider,
    UtilisationCodeRepositoryProvider,
    RouteDirectionRepositoryProvider,
    BuildingFireHydrantRepositoryProvider,
    //ConfigService,
    HttpService,
    RequestLoaderService,
    AuthenticationService,
    MessageToolsProvider,
    BuildingContactRepositoryProvider,
    ConstructionTypesRepositoryProvider,
    UnitOfMeasureRepositoryProvider,
    BuildingDetailRepositoryProvider,
    InspectionBuildingHazardousMaterialRepositoryProvider,
    HazardousMaterialRepositoryProvider,
    PersonRequiringAssistanceTypeRepositoryProvider,
    InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider,
    StaticListRepositoryProvider,
    InspectionQuestionRepositoryProvider,

    /*provideConfig({
      default: {
        //apiUrl: 'http://10.10.33.101:8080/',
        apiUrl: 'http://localhost:5555/api/',
        languages: ['fr', 'en']
      }})*/,
/*    provideConfigLoader(),
    {
      provide: HttpService,
      useFactory: httpServiceFactory,
      deps: [RequestLoaderService, ConfigService, HttpClient]
    }*/
  ]
})
export class AppModule {}
