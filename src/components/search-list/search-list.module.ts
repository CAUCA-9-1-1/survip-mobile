import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchListComponent } from './search-list';

@NgModule({
  declarations: [
    SearchListComponent,
  ],
  imports: [
    IonicPageModule.forChild(SearchListComponent),
  ],
  exports: [
    SearchListComponent
  ]
})
export class SearchListComponentModule {}
