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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    OrderByPipe,
    FormatCoordinatesPipe,
    CustomSelectComponent,
    MenuProfileComponent
  ],
  imports: [
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
  exports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    ReactiveFormsModule,
    MenuProfileComponent
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
