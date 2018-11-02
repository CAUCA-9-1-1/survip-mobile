import {NgModule} from '@angular/core';
import {SearchBoxComponent} from './search-box/search-box';
import {FormsModule} from '@angular/forms';
import {SearchListComponent} from './search-list/search-list';
import {IonicPageModule} from 'ionic-angular';
import {Camera} from '@ionic-native/camera'
import {IonicImageViewerModule} from 'ionic-img-viewer';
import {WindowRefService} from '../providers/Base/window-ref.service';
import {PicturesComponent} from './pictures/pictures.component';
import {InspectionBuildingParticularRiskDetailComponent} from './inspection-building-particular-risk-detail/inspection-building-particular-risk-detail';
import {MenuProfileComponent} from './menu-profile/menu-profile';
import {SketchToolModule} from 'lib-sketch-tool';
import {TranslateModule} from "@ngx-translate/core";
import {ParentChildQuestionComponent} from './parent-child-question/parent-child-question';
import {SurveyQuestionComponent} from './survey-question/survey-question';
import {CustomSelectComponent} from './custom-select/custom-select';

@NgModule({
    declarations: [
        SearchBoxComponent,
        SearchListComponent,
        PicturesComponent,
        InspectionBuildingParticularRiskDetailComponent,
        MenuProfileComponent,
        ParentChildQuestionComponent,
        SurveyQuestionComponent,
        CustomSelectComponent
    ],
    imports: [
        FormsModule,
        IonicPageModule.forChild(SearchBoxComponent),
        IonicPageModule.forChild(SearchListComponent),
        IonicPageModule.forChild(CustomSelectComponent),
        IonicImageViewerModule,
        SketchToolModule,
        TranslateModule.forChild(),
    ],
    exports: [
        SearchBoxComponent,
        SearchListComponent,
        PicturesComponent,
        InspectionBuildingParticularRiskDetailComponent,
        MenuProfileComponent,
        ParentChildQuestionComponent,
        SurveyQuestionComponent,
        CustomSelectComponent,
    ],
    providers: [
        WindowRefService,
        Camera,
    ]
})
export class ComponentsModule {
}
