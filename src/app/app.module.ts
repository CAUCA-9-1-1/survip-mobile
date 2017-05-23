import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
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
import { InterventionLayerDirective } from '../directives/intervention-layer/intervention-layer';
import { InterventionProvider } from '../providers/intervention/intervention';
import {CommonModule} from '@angular/common';
import {IgoModule} from 'igo2';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InspectionsPage,
    InterventionLayerDirective,
  ],
  imports: [
    HttpModule,
    //BrowserModule,
    CommonModule,
    IgoModule.forRoot(),
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      passThruUnknownUrl: true
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InspectionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    InspectionProvider,
    RiskLevelProvider,
    InterventionProvider
  ]
})
export class AppModule {}
