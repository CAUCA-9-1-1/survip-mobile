import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchBoxComponent } from './search-box';

@NgModule({
  declarations: [
    SearchBoxComponent,
  ],
  imports: [
    IonicPageModule.forChild(SearchBoxComponent),
  ],
  exports: [
    SearchBoxComponent
  ]
})
export class SearchBoxComponentModule {}
