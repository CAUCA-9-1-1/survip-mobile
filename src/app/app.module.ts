import { ErrorHandler, NgModule } from '@angular/core';
import {Http, RequestOptions, XHRBackend} from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InspectionRepositoryProvider } from '../providers/repositories/inspection-repository';
import { RiskLevelRepositoryProvider } from '../providers/repositories/risk-level-repository';
import {InMemoryDataService} from '../mockdata/in-memory-data.service';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {HttpModule} from '@angular/http';
import {
  IgoModule,
  LanguageLoader,
  provideLanguageLoader,
} from 'igo2';
import {NotificationsService} from 'angular2-notifications/dist';
import {InterventionRepositoryProvider} from '../providers/repositories/intervention-repository';
import { InterventionControllerProvider } from '../providers/intervention-controller/intervention-controller';
import { LaneRepositoryProvider } from '../providers/repositories/lane-repository';
import {InterventionDetailRepositoryProvider} from '../providers/repositories/intervention-detail-repository';
import {RequestLoaderService} from '../providers/Base/request-loader.service';
import {HttpService} from '../providers/Base/http.service';
import {ConfigService} from '../providers/Base/config.service';
import {AuthorizeRequestOptions} from '../providers/Base/authorize-request-options';
import {provideConfig, provideConfigLoader} from '../providers/Base/config.provider';
import {PictureRepositoryProvider} from '../providers/repositories/picture-repository';
import {InterventionBuildingsRepositoryProvider} from '../providers/repositories/intervention-buildings-repository';
import {ComponentsModule} from '../components/components.module';
import {FormsModule} from '@angular/forms';
import {InterventionPlanCourseRepositoryProvider} from '../providers/repositories/intervention-plan-course-repository';
import {InterventionPlanCourseLaneRepositoryProvider} from '../providers/repositories/intervention-plan-course-lane-repository';
import {FirestationRepositoryProvider} from '../providers/repositories/firestation-repository';
import {RouteDirectionRepositoryProvider} from '../providers/repositories/route-direction-repository';
import {DirectivesModule} from '../directives/directives.module';
import {CommonModule} from '@angular/common';
import {InspectionsPageModule} from '../pages/inspections/inspections.module';
import {InspectionMapPageModule} from '../pages/inspection-map/inspection-map.module';
import {InspectionMapPage} from '../pages/inspection-map/inspection-map';
import {AuthService} from '../providers/Base/auth.service';
import {AuthenticationService} from '../providers/Base/authentification.service';

export function translateLoader(http: Http) {
  return new LanguageLoader(http, './assets/locale/', '.json');
}

export function httpServiceFactory(
  backend: XHRBackend,
  options: AuthorizeRequestOptions,
  loaderService: RequestLoaderService,
  configService: ConfigService
) {
  return new HttpService(backend, options, configService, loaderService);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    //InterventionHomePage,
  ],
  imports: [
    InspectionMapPageModule,
    FormsModule,
    IgoModule.forRoot(),
    HttpModule,
    CommonModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      passThruUnknownUrl: true
    }),
    IonicModule.forRoot(MyApp),
    ComponentsModule,
    DirectivesModule,
    InspectionsPageModule,
    //InspectionMapPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    //InterventionHomePage,
  ],
  exports: [
    IgoModule,
  ],
  providers: [
    InspectionMapPage,
    NotificationsService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    provideLanguageLoader(translateLoader),
    PictureRepositoryProvider,
    InterventionRepositoryProvider,
    InspectionRepositoryProvider,
    RiskLevelRepositoryProvider,
    InterventionControllerProvider,
    LaneRepositoryProvider,
    InterventionDetailRepositoryProvider,
    InterventionBuildingsRepositoryProvider,
    InterventionPlanCourseRepositoryProvider,
    InterventionPlanCourseLaneRepositoryProvider,
    FirestationRepositoryProvider,
    RouteDirectionRepositoryProvider,
    ConfigService,
    HttpService,
    RequestLoaderService,
    AuthenticationService,
    AuthorizeRequestOptions,
    provideConfig({
      default: {
        //apiUrl: 'http://10.10.33.101:8080/',
        apiUrl: 'http://localhost:5555/',
        languages: ['fr', 'en']
      }}),
    provideConfigLoader(),
    {
      provide: HttpService,
      useFactory: httpServiceFactory,
      deps: [XHRBackend, RequestOptions, RequestLoaderService, ConfigService]
    }
    /*provideConfig({
      default: {
        apiUrl: 'http://cadevsprevention1/api/',
        languages: ['fr', 'en']
      }
      // path: './assets/config-cause.json'
    }),*/
  ]
})
export class AppModule {}
