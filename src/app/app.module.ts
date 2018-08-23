import { ErrorHandler, NgModule } from '@angular/core';
import {Events, IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
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
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
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
import {MessageToolsProvider} from '../providers/message-tools/message-tools';
import {BuildingFireHydrantRepositoryProvider} from "../providers/repositories/building-fire-hydrant-repository";
import {BuildingContactRepositoryProvider} from '../providers/repositories/building-contact-repository';
import {ConstructionTypesRepositoryProvider} from '../providers/repositories/construction-types-repository';
import {UnitOfMeasureRepositoryProvider} from '../providers/repositories/unit-of-measure-repository';
import {BuildingDetailRepositoryProvider} from '../providers/repositories/building-detail-repository';
import {InspectionQuestionRepositoryProvider} from "../providers/repositories/inspection-question-repository-provider";
import {InspectionBuildingHazardousMaterialRepositoryProvider} from '../providers/repositories/inspection-building-hazardous-material-repository';
import {HazardousMaterialRepositoryProvider} from '../providers/repositories/hazardous-material-repository';
import {PersonRequiringAssistanceTypeRepositoryProvider} from '../providers/repositories/person-requiring-assistance-type-repository';
import {InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider} from '../providers/repositories/inspection-building-person-requiring-assistance-type-repository';
import {StaticListRepositoryProvider} from '../providers/static-list-repository/static-list-repository';
import {InspectionBuildingSprinklerRepositoryProvider} from '../providers/repositories/inspection-building-sprinkler-repository-provider.service';
import {InspectionBuildingAlarmPanelRepositoryProvider} from '../providers/repositories/inspection-building-alarm-panel-repository-provider.service';
import {AlarmPanelTypeRepository} from '../providers/repositories/alarm-panel-type-repository.service';
import {SprinklerTypeRepository} from '../providers/repositories/sprinkler-type-repository.service';
import {InspectionBuildingAnomalyRepositoryProvider} from '../providers/repositories/inspection-building-anomaly-repository-provider.service';
import {InspectionBuildingAnomalyPictureRepositoryProvider} from '../providers/repositories/inspection-building-anomaly-picture-repository-provider.service';
import {InspectionBuildingParticularRiskPictureRepositoryProvider} from '../providers/repositories/inspection-building-particular-risk-picture-repository-provider.service';
import {InspectionBuildingParticularRiskRepositoryProvider} from '../providers/repositories/inspection-building-particular-risk-repository-provider.service';
import {TranslateService} from "@ngx-translate/core";
import {FireHydrantRepositoryProvider} from "../providers/repositories/fire-hydrant-repository-provider";
import {OperatorTypeRepositoryProvider} from "../providers/repositories/operator-type-repository-provider";
import {MapLocalizationRepositoryService} from "../providers/repositories/map-localisation-repository-service";
import {ExpiredTokenInterceptor} from '../providers/Base/expired-token.interceptor';
import {Geolocation} from "@ionic-native/geolocation";
import {Diagnostic} from "@ionic-native/diagnostic";
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {CityRepositoryProvider} from "../providers/repositories/city-repository-provider";
import { InspectionConfigurationProvider } from '../providers/inspection-configuration/inspection-configuration';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function httpServiceFactory(
  client: HttpClient,
  translate: TranslateService,
  events: Events
) {
  return new HttpService(client, translate, events);
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
        IonicModule.forRoot(MyApp, {scrollAssist: false,
    autoFocusAssist: false}),
        BrowserModule,
        ComponentsModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
    ],
    exports: [],
    providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ExpiredTokenInterceptor, multi: true },
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
        FireHydrantRepositoryProvider,
        OperatorTypeRepositoryProvider,
        MapLocalizationRepositoryService,
        Geolocation,
        Diagnostic,
        NativeGeocoder,
        CityRepositoryProvider,
    InspectionConfigurationProvider,
    ]
})
export class AppModule {
}
