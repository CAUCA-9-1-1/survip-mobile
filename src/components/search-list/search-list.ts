import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {NavParams, ViewController} from 'ionic-angular';
import 'rxjs/add/operator/debounceTime'
import {ServiceForListInterface} from '../../interfaces/service-for-list.interface';

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
        this.dataService = params.get('dataService');
        this.keyFieldName = params.get('keyFieldName');
        this.displayFieldName = params.get('displayFieldName');
        this.searchControl = new FormControl();
    }

    ionViewDidLoad() {
        this.setFilteredItems();
        this.searchControl.valueChanges.debounceTime(500).subscribe(() => {
            this.searching = false;
            this.setFilteredItems();
        });
    }

    onSearchInput() {
        this.searching = true;
    }

    setFilteredItems() {
        this.dataService.getList(this.searchTerm, this.displayFieldName).subscribe(list => {
            this.items = list
        });
    }

    onSelectItem(id: string) {
        this.viewCtrl.dismiss(id);
    }

    onCancelSelection() {
        this.viewCtrl.dismiss();
    }
}
