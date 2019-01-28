import {ErrorHandler, NgModule } from '@angular/core';
import {Events, IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen } from '@ionic-native/splash-screen';
import {StatusBar } from '@ionic-native/status-bar';
import {MyApp } from './app.component';
import {RiskLevelRepositoryProvider } from '../providers/repositories/risk-level-repository';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader } from '@ngx-translate/http-loader';
import {LaneRepositoryProvider } from '../providers/repositories/lane-repository';
import {RequestLoaderService} from '../providers/Base/request-loader.service';
import {HttpService} from '../providers/Base/http.service';
import {PictureRepositoryProvider} from '../providers/repositories/picture-repository';
import {ComponentsModule} from '../components/components.module';
import {FormsModule} from '@angular/forms';
import {RouteDirectionRepositoryProvider} from '../providers/repositories/route-direction-repository';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from '../providers/Base/authentification.service';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {InspectionBuildingCourseLaneRepositoryProvider} from '../providers/repositories/inspection-building-course-lane-repository-provider.service';
import {InspectionBuildingFireHydrantRepositoryProvider} from '../providers/repositories/inspection-building-fire-hydrant-repository-provider';
import {InspectionBuildingCourseRepositoryProvider} from '../providers/repositories/inspection-building-course-repository';
import {InspectionDetailRepositoryProvider} from '../providers/repositories/inspection-detail-repository-provider.service';
import {InspectionControllerProvider} from '../providers/inspection-controller/inspection-controller';
import {InspectionRepositoryProvider} from '../providers/repositories/inspection-repository-provider.service';
import {FirestationRepositoryProvider} from '../providers/repositories/firestation-repository-provider.service';
import {MessageToolsProvider} from '../providers/message-tools/message-tools';
import {BuildingContactRepositoryProvider} from '../providers/repositories/building-contact-repository';
import {ConstructionTypesRepositoryProvider} from '../providers/repositories/construction-types-repository';
import {UnitOfMeasureRepositoryProvider} from '../providers/repositories/unit-of-measure-repository';
import {BuildingDetailRepositoryProvider} from '../providers/repositories/building-detail-repository';
import {InspectionSurveyAnswerRepositoryProvider} from "../providers/repositories/inspection-survey-answer-repository-provider";
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
import {InspectionConfigurationProvider} from '../providers/inspection-configuration/inspection-configuration';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {HockeyApp} from 'ionic-hockeyapp';
import { RepositoriesFireHydrantValidatorProvider } from '../providers/repositories-fire-hydrant-validator/repositories-fire-hydrant-validator';
import { FireHydrantValidatorProvider } from '../providers/repositories/fire-hydrant-validator-provider';
import {AppVersion} from "@ionic-native/app-version";
import {Market} from "@ionic-native/market";
import { PictureUtilitiesProvider } from '../providers/picture-utilities/picture-utilities';
import {IonicStorageModule} from "@ionic/storage";
import { OfflineDataSynchronizerProvider } from '../providers/offline-data-synchronizer/offline-data-synchronizer';
import { RiskLevelDataSynchronizerProvider } from '../providers/risk-level-data-synchronizer/risk-level-data-synchronizer';
import { UnitOfMeasureDataSynchronizerProvider } from '../providers/unit-of-measure-data-synchronizer/unit-of-measure-data-synchronizer';
import { ConstructionTypeDataSynchronizerProvider } from '../providers/construction-type-data-synchronizer/construction-type-data-synchronizer';
import { AlarmTypeDataSynchronizerProvider } from '../providers/alarm-type-data-synchronizer/alarm-type-data-synchronizer';
import { FireHydrantTypeDataSynchronizerProvider } from '../providers/fire-hydrant-type-data-synchronizer/fire-hydrant-type-data-synchronizer';
import { PersonRequiringAssistanceTypeDataSynchronizerProvider } from '../providers/person-requiring-assistance-type-data-synchronizer/person-requiring-assistance-type-data-synchronizer';
import { SprinklerTypeDataSynchronizerProvider } from '../providers/sprinkler-type-data-synchronizer/sprinkler-type-data-synchronizer';
import { RouteDirectionTypeDataSynchronizerProvider } from '../providers/route-direction-type-data-synchronizer/route-direction-type-data-synchronizer';
import { LaneDataSynchronizerProvider } from '../providers/lane-data-synchronizer/lane-data-synchronizer';
import { HazardousMaterialDataSynchronizerProvider } from '../providers/hazardous-material-data-synchronizer/hazardous-material-data-synchronizer';
import { InspectionDataSynchronizerProvider } from '../providers/inspection-data-synchronizer/inspection-data-synchronizer';
import { CityDataSynchronizerProvider } from '../providers/city-data-synchronizer/city-data-synchronizer';
import { FirestationDataSynchronizerProvider } from '../providers/firestation-data-synchronizer/firestation-data-synchronizer';
import { AnomalyThemeDataSynchronizerProvider } from '../providers/anomaly-theme-data-synchronizer/anomaly-theme-data-synchronizer';

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
        IonicModule.forRoot(MyApp, {scrollAssist: false,autoFocusAssist: false}),
        IonicStorageModule.forRoot({
          name: '__mydb',
          driverOrder: ['sqlite', 'indexeddb', 'websql']
        }),
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
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        PictureRepositoryProvider,
        RiskLevelRepositoryProvider,
        InspectionControllerProvider,
        LaneRepositoryProvider,
        InspectionRepositoryProvider,
        InspectionDetailRepositoryProvider,
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
        RouteDirectionRepositoryProvider,
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
        InspectionSurveyAnswerRepositoryProvider,
        FireHydrantRepositoryProvider,
        OperatorTypeRepositoryProvider,
        MapLocalizationRepositoryService,
        Geolocation,
        Diagnostic,
        NativeGeocoder,
        CityRepositoryProvider,
        InspectionConfigurationProvider,
        KeychainTouchId,
        HockeyApp,
        FireHydrantValidatorProvider,
        AppVersion,
        Market,
    PictureUtilitiesProvider,
    OfflineDataSynchronizerProvider,
    RiskLevelDataSynchronizerProvider,
    UnitOfMeasureDataSynchronizerProvider,
    ConstructionTypeDataSynchronizerProvider,
    AlarmTypeDataSynchronizerProvider,
    FireHydrantTypeDataSynchronizerProvider,
    PersonRequiringAssistanceTypeDataSynchronizerProvider,
    SprinklerTypeDataSynchronizerProvider,
    RouteDirectionTypeDataSynchronizerProvider,
    LaneDataSynchronizerProvider,
    HazardousMaterialDataSynchronizerProvider,
    InspectionDataSynchronizerProvider,
    CityDataSynchronizerProvider,
    FirestationDataSynchronizerProvider,
    AnomalyThemeDataSynchronizerProvider,
    AnomalyThemeDataSynchronizerProvider,
    ]
})
export class AppModule {
}
