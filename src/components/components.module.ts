import { NgModule } from '@angular/core';
import { SearchBoxComponent } from './search-box/search-box';
import {FormsModule} from '@angular/forms';
import { SearchListComponent } from './search-list/search-list';
import {IonicPageModule} from 'ionic-angular';
import { PictureViewerComponent } from './picture-viewer/picture-viewer';
import {Camera} from '@ionic-native/camera'
import {PhotoViewer} from '@ionic-native/photo-viewer';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import {WindowRefService} from '../providers/Base/window-ref.service';
import {BuildingChildPicturesComponent} from './building-child-pictures/building-child-pictures';
import { InspectionBuildingParticularRiskDetailComponent } from './inspection-building-particular-risk-detail/inspection-building-particular-risk-detail';

@NgModule({
	declarations: [
	  SearchBoxComponent,
    SearchListComponent,
    PictureViewerComponent,
    BuildingChildPicturesComponent,
    InspectionBuildingParticularRiskDetailComponent
  ],
	imports: [
	  FormsModule,
    IonicPageModule.forChild(SearchBoxComponent),
    IonicPageModule.forChild(SearchListComponent),
    IonicImageViewerModule
  ],
	exports: [
	  SearchBoxComponent,
    SearchListComponent,
    PictureViewerComponent,
    BuildingChildPicturesComponent,
    InspectionBuildingParticularRiskDetailComponent
  ],
  providers: [
    WindowRefService,
    Camera,
    PhotoViewer
  ]
})
export class ComponentsModule {}
