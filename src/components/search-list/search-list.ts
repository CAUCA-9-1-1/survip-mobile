import {Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import {NavParams, ViewController} from 'ionic-angular';
import 'rxjs/add/operator/debounceTime'
import {ServiceForListInterface} from '../../interfaces/service-for-list.interface';

/**
 * Generated class for the SearchListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'search-list',
  templateUrl: 'search-list.html'
})
export class SearchListComponent {
  dataService: ServiceForListInterface;
  keyFieldName: string;
  displayFieldName: string;

  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  searching: any = false;

  constructor(public viewCtrl: ViewController, params: NavParams) {
    console.log(params);
    this.dataService = params.get('dataService');
    this.keyFieldName = params.get('keyFieldName');
    this.displayFieldName = params.get('displayFieldName');

    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.setFilteredItems();

    this.searchControl.valueChanges.debounceTime(1000).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  onSearchInput(){
    this.searching = true;
  }

  setFilteredItems() {
    this.dataService.getList(this.searchTerm, this.displayFieldName).subscribe(list => this.items = list);
  }

  onSelectItem(id: string){
    this.viewCtrl.dismiss(id);
  }

  onCancelSelection(){
    this.viewCtrl.dismiss();
  }
}
