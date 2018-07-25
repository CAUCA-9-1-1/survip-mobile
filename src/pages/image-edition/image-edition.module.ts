import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageEditionPage } from './image-edition';
import { SketchToolModule } from 'lib-sketch-tool';

@NgModule({
  declarations: [
    ImageEditionPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageEditionPage),
    SketchToolModule,
  ],
})
export class ImageEditionPageModule {}
