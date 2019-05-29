import { Component, OnInit } from '@angular/core';
import { ServiceForListInterface } from '../../interfaces/service-for-list.interface';
import { FormControl } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
})
export class SearchListComponent implements OnInit {

  public dataService: ServiceForListInterface;
  public keyFieldName: string;
  public displayFieldName: string;
  public disabledValue: string;
  public searchTerm: string = '';
  public searchControl: FormControl;
  public items: any;
  public searching: any = false;

  constructor(public modalCtrl: ModalController, params: NavParams) {
    this.dataService = params.get('dataService');
    this.keyFieldName = params.get('keyFieldName');
    this.displayFieldName = params.get('displayFieldName');
    this.disabledValue = params.get('disabledValue');
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.setFilteredItems();
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  public onSearchInput() {
    this.searching = true;
  }

  public setFilteredItems() {
    this.dataService.getList(this.searchTerm.trim(), this.displayFieldName).subscribe(list => {
        this.items = list;
    });
  }

  public onSelectItem(id: string) {
    this.modalCtrl.dismiss(id);
  }

  public onCancelSelection() {
    this.modalCtrl.dismiss();
  }
}
