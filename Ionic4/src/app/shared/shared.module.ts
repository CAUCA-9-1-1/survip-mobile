import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OrderByPipe } from './pipes/order-by.pipe';
import { FormatCoordinatesPipe } from './pipes/format-coordinates.pipe';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    OrderByPipe,
    FormatCoordinatesPipe,
    CustomSelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  entryComponents: [
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
  ]
})
export class SharedModule {
}
