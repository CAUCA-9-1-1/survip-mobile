import { NgModule } from '@angular/core';
import { SearchBoxComponent } from './search-box/search-box';
import { FormsModule } from '@angular/forms';
import { SearchListComponent } from './search-list/search-list';
import { IonicPageModule } from 'ionic-angular';
import { PictureViewerComponent } from './picture-viewer/picture-viewer';
import { Camera } from '@ionic-native/camera';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { WindowRefService } from '../providers/Base/window-ref.service';
import { BuildingChildPicturesComponent } from './building-child-pictures/building-child-pictures';
import { InspectionBuildingParticularRiskDetailComponent } from './inspection-building-particular-risk-detail/inspection-building-particular-risk-detail';
import { MenuProfileComponent } from './menu-profile/menu-profile';
import { SketchToolModule } from 'lib-sketch-tool';


@NgModule({
	declarations: [
	  SearchBoxComponent,
    SearchListComponent,
    PictureViewerComponent,
    BuildingChildPicturesComponent,
    InspectionBuildingParticularRiskDetailComponent,
    MenuProfileComponent
  ],
	imports: [
	  FormsModule,
    IonicPageModule.forChild(SearchBoxComponent),
    IonicPageModule.forChild(SearchListComponent),
    IonicImageViewerModule,
    SketchToolModule,
  ],
	exports: [
	  SearchBoxComponent,
    SearchListComponent,
    PictureViewerComponent,
    BuildingChildPicturesComponent,
    InspectionBuildingParticularRiskDetailComponent,
    MenuProfileComponent,
  ],
  providers: [
    WindowRefService,
    Camera,
  ]
})
export class ComponentsModule {}
