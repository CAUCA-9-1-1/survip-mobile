import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingChildPictureEditionPage } from './building-child-picture-edition';
import { SketchToolModule } from 'lib-sketch-tool';
import { fabric } from 'fabric';

@NgModule({
  declarations: [
    BuildingChildPictureEditionPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingChildPictureEditionPage),
    SketchToolModule,
  ],
})
export class ImageEditionPageModule {}
