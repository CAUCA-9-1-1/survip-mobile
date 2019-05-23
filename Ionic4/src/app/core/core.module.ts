import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { PictureRepositoryProvider } from './services/repositories/picture-repository';
import { RiskLevelRepositoryProvider } from './services/repositories/risk-level-repository';
import { InspectionControllerProvider } from './services/controllers/inspection-controller/inspection-controller';
import { LaneRepositoryProvider } from './services/repositories/lane-repository';
import { InspectionRepositoryProvider } from './services/repositories/inspection-repository-provider.service';
import { InspectionBuildingCourseRepositoryProvider } from './services/repositories/inspection-building-course-repository';
import { InspectionBuildingCourseLaneRepositoryProvider } from './services/repositories/inspection-building-course-lane-repository-provider.service';
import { InspectionBuildingFireHydrantRepositoryProvider } from './services/repositories/inspection-building-fire-hydrant-repository-provider';
import { InspectionBuildingSprinklerRepositoryProvider } from './services/repositories/inspection-building-sprinkler-repository-provider.service';
import { InspectionBuildingAlarmPanelRepositoryProvider } from './services/repositories/inspection-building-alarm-panel-repository-provider.service';
import { InspectionBuildingAnomalyRepositoryProvider } from './services/repositories/inspection-building-anomaly-repository-provider.service';
import { InspectionBuildingAnomalyPictureRepositoryProvider } from './services/repositories/inspection-building-anomaly-picture-repository-provider.service';
import { InspectionBuildingParticularRiskPictureRepositoryProvider } from './services/repositories/inspection-building-particular-risk-picture-repository-provider.service';
import { InspectionBuildingParticularRiskRepositoryProvider } from './services/repositories/inspection-building-particular-risk-repository-provider.service';
import { AlarmPanelTypeRepository } from './services/repositories/alarm-panel-type-repository.service';
import { SprinklerTypeRepository } from './services/repositories/sprinkler-type-repository.service';
import { FirestationRepositoryProvider } from './services/repositories/firestation-repository-provider.service';
import { RouteDirectionRepositoryProvider } from './services/repositories/route-direction-repository';
import { HttpService } from './services/base/http.service';
import { MessageToolsProvider } from './services/utilities/message-tools/message-tools';
import { BuildingContactRepositoryProvider } from './services/repositories/building-contact-repository';
import { ConstructionTypesRepositoryProvider } from './services/repositories/construction-types-repository';
import { UnitOfMeasureRepositoryProvider } from './services/repositories/unit-of-measure-repository';
import { BuildingDetailRepositoryProvider } from './services/repositories/building-detail-repository';
import { InspectionBuildingHazardousMaterialRepositoryProvider } from './services/repositories/inspection-building-hazardous-material-repository';
import { HazardousMaterialRepositoryProvider } from './services/repositories/hazardous-material-repository';
import { PersonRequiringAssistanceTypeRepositoryProvider } from './services/repositories/person-requiring-assistance-type-repository';
import { InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider } from './services/repositories/inspection-building-person-requiring-assistance-type-repository';
import { StaticListRepositoryProvider } from './services/repositories/static-list-repository/static-list-repository';
import { InspectionSurveyAnswerRepositoryProvider } from './services/repositories/inspection-survey-answer-repository-provider';
import { FireHydrantRepositoryProvider } from './services/repositories/fire-hydrant-repository-provider';
import { CityRepositoryProvider } from './services/repositories/city-repository-provider';
import { InspectionConfigurationProvider } from './services/controllers/inspection-configuration/inspection-configuration';
import { FireHydrantValidatorProvider } from './services/utilities/fire-hydrant-validator-provider';
import { PictureUtilitiesProvider } from './services/utilities/picture-utilities/picture-utilities';
import { OfflineDataSynchronizerProvider } from './services/controllers/offline-data-synchronizer/offline-data-synchronizer';
import { RiskLevelDataSynchronizerProvider } from './services/http/risk-level-data-synchronizer/risk-level-data-synchronizer';
import { UnitOfMeasureDataSynchronizerProvider } from './services/http/unit-of-measure-data-synchronizer/unit-of-measure-data-synchronizer';
import { ConstructionTypeDataSynchronizerProvider } from './services/http/construction-type-data-synchronizer/construction-type-data-synchronizer';
import { AlarmTypeDataSynchronizerProvider } from './services/http/alarm-type-data-synchronizer/alarm-type-data-synchronizer';
import { FireHydrantTypeDataSynchronizerProvider } from './services/http/fire-hydrant-type-data-synchronizer/fire-hydrant-type-data-synchronizer';
import { PersonRequiringAssistanceTypeDataSynchronizerProvider } from './services/http/person-requiring-assistance-type-data-synchronizer/person-requiring-assistance-type-data-synchronizer';
import { SprinklerTypeDataSynchronizerProvider } from './services/http/sprinkler-type-data-synchronizer/sprinkler-type-data-synchronizer';
import { RouteDirectionTypeDataSynchronizerProvider } from './services/http/route-direction-type-data-synchronizer/route-direction-type-data-synchronizer';
import { LaneDataSynchronizerProvider } from './services/http/lane-data-synchronizer/lane-data-synchronizer';
import { HazardousMaterialDataSynchronizerProvider } from './services/http/hazardous-material-data-synchronizer/hazardous-material-data-synchronizer';
import { InspectionDataSynchronizerProvider } from './services/http/inspection-data-synchronizer/inspection-data-synchronizer';
import { CityDataSynchronizerProvider } from './services/http/city-data-synchronizer/city-data-synchronizer';
import { FirestationDataSynchronizerProvider } from './services/http/firestation-data-synchronizer/firestation-data-synchronizer';
import { AnomalyThemeDataSynchronizerProvider } from './services/http/anomaly-theme-data-synchronizer/anomaly-theme-data-synchronizer';
import { InspectionUploaderProvider } from './services/controllers/inspection-uploader/inspection-uploader';
import { AuthenticationService } from './services/authentication/authentification.service';
import { LoginActivate } from './guards/login.activate';

@NgModule({
  declarations: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    PictureRepositoryProvider,
    RiskLevelRepositoryProvider,
    InspectionControllerProvider,
    LaneRepositoryProvider,
    InspectionRepositoryProvider,
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
    CityRepositoryProvider,
    InspectionConfigurationProvider,
    KeychainTouchId,
    FireHydrantValidatorProvider,
    AppVersion,
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
    InspectionUploaderProvider,
    LoginActivate
  ],
  imports: [
  ],
  entryComponents: [
  ],
  exports: [
  ]
})
export class CoreModule {
}
