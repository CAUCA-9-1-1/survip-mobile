import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {Http} from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InspectionsPage } from '../pages/inspections/inspections';
import { InspectionProvider } from '../providers/inspection/inspection';
import { RiskLevelProvider } from '../providers/risk-level/risk-level';
import {InMemoryDataService} from '../mockdata/in-memory-data.service';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {HttpModule} from '@angular/http';
import {
  IgoModule,
  LanguageLoader,
  provideLanguageLoader,
} from 'igo2';
import {NotificationsService} from 'angular2-notifications/dist';
import {InterventionHomePage} from '../pages/intervention-home/intervention-home';
import {InterventionGeneralPage} from '../pages/intervention-general/intervention-general';
import {InterventionProvider} from '../providers/intervention/intervention';
import {InspectionMapPage} from '../pages/inspection-map/inspection-map';
import {MaterialModule} from '@angular/material';

export function translateLoader(http: Http) {
  return new LanguageLoader(http, './assets/locale/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InspectionsPage,
    InspectionMapPage,
    InterventionHomePage,
    InterventionGeneralPage,
    // InterventionLayerDirective,
  ],
  imports: [
    IgoModule.forRoot(),
    MaterialModule,
    HttpModule,
    BrowserModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      passThruUnknownUrl: true
    }),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InspectionMapPage,
    InspectionsPage,
    InterventionHomePage,
    InterventionGeneralPage,
  ],
  exports: [
    IgoModule
  ],
  providers: [
    NotificationsService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    provideLanguageLoader(translateLoader),
    InterventionProvider,
    InspectionProvider,
    RiskLevelProvider,
  ]
})
export class AppModule {}
