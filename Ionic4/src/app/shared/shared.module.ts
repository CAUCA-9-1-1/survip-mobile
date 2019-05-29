import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OrderByPipe } from './pipes/order-by.pipe';
import { FormatCoordinatesPipe } from './pipes/format-coordinates.pipe';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MenuProfileComponent } from './components/menu-profile/menu-profile.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { PicturesComponent } from './components/pictures/pictures.component';
import {Camera} from '@ionic-native/camera/ngx';
import { PictureEditionComponent } from './components/picture-edition/picture-edition.component';
//import { SketchToolModule } from 'lib-sketch-tool';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    OrderByPipe,
    FormatCoordinatesPipe,
    CustomSelectComponent,
    MenuProfileComponent,
    SearchListComponent,
    SearchBoxComponent,
    PicturesComponent,
    PictureEditionComponent
  ],
  imports: [
    // SketchToolModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: false
    })
  ],
  entryComponents: [
  ],
  providers: [
    Camera,
    SearchBoxComponent,
    SearchListComponent,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MenuProfileComponent,
    OrderByPipe,
    FormatCoordinatesPipe,
    CustomSelectComponent,
    SearchBoxComponent,
    SearchListComponent,
    PicturesComponent,
    PictureEditionComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
