import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { InspectionBuildingPagesGuard } from './guards/inspection-building-pages.guard';
import { InspectionPagesGuard } from './guards/inspection-pages.guard';
import { LoginActivate } from './guards/login.activate';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { HttpService } from './services/base/http.service';
import { InspectionConfigurationProvider } from './services/controllers/inspection-configuration/inspection-configuration';
import { InspectionControllerProvider } from './services/controllers/inspection-controller/inspection-controller';
import { InspectionUploaderProvider } from './services/controllers/inspection-uploader/inspection-uploader';
import { OfflineDataSynchronizerProvider } from './services/controllers/offline-data-synchronizer/offline-data-synchronizer';
import { AlarmTypeDataSynchronizerProvider } from './services/http/alarm-type-data-synchronizer/alarm-type-data-synchronizer';
import { AnomalyThemeDataSynchronizerProvider } from './services/http/anomaly-theme-data-synchronizer/anomaly-theme-data-synchronizer';
import { CityDataSynchronizerProvider } from './services/http/city-data-synchronizer/city-data-synchronizer';
import { ConstructionTypeDataSynchronizerProvider } from './services/http/construction-type-data-synchronizer/construction-type-data-synchronizer';
import { FireHydrantTypeDataSynchronizerProvider } from './services/http/fire-hydrant-type-data-synchronizer/fire-hydrant-type-data-synchronizer';
import { FirestationDataSynchronizerProvider } from './services/http/firestation-data-synchronizer/firestation-data-synchronizer';
import { HazardousMaterialDataSynchronizerProvider } from './services/http/hazardous-material-data-synchronizer/hazardous-material-data-synchronizer';
import { InspectionDataSynchronizerProvider } from './services/http/inspection-data-synchronizer/inspection-data-synchronizer';
import { LaneDataSynchronizerProvider } from './services/http/lane-data-synchronizer/lane-data-synchronizer';
import { PersonRequiringAssistanceTypeDataSynchronizerProvider } from './services/http/person-requiring-assistance-type-data-synchronizer/person-requiring-assistance-type-data-synchronizer';
import { RiskLevelDataSynchronizerProvider } from './services/http/risk-level-data-synchronizer/risk-level-data-synchronizer';
import { RouteDirectionTypeDataSynchronizerProvider } from './services/http/route-direction-type-data-synchronizer/route-direction-type-data-synchronizer';
import { SprinklerTypeDataSynchronizerProvider } from './services/http/sprinkler-type-data-synchronizer/sprinkler-type-data-synchronizer';
import { UnitOfMeasureDataSynchronizerProvider } from './services/http/unit-of-measure-data-synchronizer/unit-of-measure-data-synchronizer';
import { AlarmPanelTypeRepository } from './services/repositories/alarm-panel-type-repository.service';
import { BuildingContactRepositoryProvider } from './services/repositories/building-contact-repository';
import { BuildingDetailRepositoryProvider } from './services/repositories/building-detail-repository';
import { CityRepositoryProvider } from './services/repositories/city-repository-provider';
import { ConstructionTypesRepositoryProvider } from './services/repositories/construction-types-repository';
import { FireHydrantRepositoryProvider } from './services/repositories/fire-hydrant-repository-provider';
import { FirestationRepositoryProvider } from './services/repositories/firestation-repository-provider.service';
import { HazardousMaterialRepositoryProvider } from './services/repositories/hazardous-material-repository';
import { InspectionBuildingAlarmPanelRepositoryProvider } from './services/repositories/inspection-building-alarm-panel-repository-provider.service';
import { InspectionBuildingAnomalyPictureRepositoryProvider } from './services/repositories/inspection-building-anomaly-picture-repository-provider.service';
import { InspectionBuildingAnomalyRepositoryProvider } from './services/repositories/inspection-building-anomaly-repository-provider.service';
import { InspectionBuildingCourseLaneRepositoryProvider } from './services/repositories/inspection-building-course-lane-repository-provider.service';
import { InspectionBuildingCourseRepositoryProvider } from './services/repositories/inspection-building-course-repository';
import { InspectionBuildingFireHydrantRepositoryProvider } from './services/repositories/inspection-building-fire-hydrant-repository-provider';
import { InspectionBuildingHazardousMaterialRepositoryProvider } from './services/repositories/inspection-building-hazardous-material-repository';
import { InspectionBuildingParticularRiskPictureRepositoryProvider } from './services/repositories/inspection-building-particular-risk-picture-repository-provider.service';
import { InspectionBuildingParticularRiskRepositoryProvider } from './services/repositories/inspection-building-particular-risk-repository-provider.service';
import { InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider } from './services/repositories/inspection-building-person-requiring-assistance-type-repository';
import { InspectionBuildingSprinklerRepositoryProvider } from './services/repositories/inspection-building-sprinkler-repository-provider.service';
import { InspectionRepositoryProvider } from './services/repositories/inspection-repository-provider.service';
import { InspectionSurveyAnswerRepositoryProvider } from './services/repositories/inspection-survey-answer-repository-provider';
import { LaneRepositoryProvider } from './services/repositories/lane-repository';
import { PersonRequiringAssistanceTypeRepositoryProvider } from './services/repositories/person-requiring-assistance-type-repository';
import { PictureRepositoryProvider } from './services/repositories/picture-repository';
import { RiskLevelRepositoryProvider } from './services/repositories/risk-level-repository';
import { RouteDirectionRepositoryProvider } from './services/repositories/route-direction-repository';
import { SprinklerTypeRepository } from './services/repositories/sprinkler-type-repository.service';
import { StaticListRepositoryProvider } from './services/repositories/static-list-repository/static-list-repository';
import { UnitOfMeasureRepositoryProvider } from './services/repositories/unit-of-measure-repository';
import { FireHydrantValidatorProvider } from './services/utilities/fire-hydrant-validator-provider';
import { MessageToolsProvider } from './services/utilities/message-tools/message-tools';
import { PictureUtilitiesProvider } from './services/utilities/picture-utilities/picture-utilities';
import { WindowRefService } from './services/utilities/window-ref.service';
import { InspectionListGuard } from './guards/inspection-list.guard';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    WindowRefService,
    PictureRepositoryProvider,
    RiskLevelRepositoryProvider,
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
    InspectionUploaderProvider
  ],
  imports: [
    IonicModule
  ],
  entryComponents: [
  ],
  exports: [
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        InspectionPagesGuard,
        InspectionBuildingPagesGuard,
        LoginActivate,
        InspectionConfigurationProvider,
        InspectionControllerProvider,
        InspectionListGuard,
        LaneRepositoryProvider
      ]
    };
  }
}

