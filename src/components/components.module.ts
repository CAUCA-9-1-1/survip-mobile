import { NgModule } from '@angular/core';
import { SearchBoxComponent } from './search-box/search-box';
import {FormsModule} from '@angular/forms';
import { SearchListComponent } from './search-list/search-list';
import {IonicPageModule} from 'ionic-angular';
@NgModule({
	declarations: [
	  SearchBoxComponent,
    SearchListComponent
  ],
	imports: [
	  FormsModule,
    IonicPageModule.forChild(SearchBoxComponent),
    IonicPageModule.forChild(SearchListComponent),
  ],
	exports: [
	  SearchBoxComponent,
    SearchListComponent
  ]
})
export class ComponentsModule {}
