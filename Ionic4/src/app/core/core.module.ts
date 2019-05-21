import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';


@NgModule({
  declarations: [
  ],
  imports: [
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
  ],
  entryComponents: [
  ],
  exports: [
  ]
})
export class CoreModule {
}
