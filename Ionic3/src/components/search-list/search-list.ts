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

    public dataService: ServiceForListInterface;
    public keyFieldName: string;
    public displayFieldName: string;
    public disabledValue: string;
    public searchTerm: string = '';
    public searchControl: FormControl;
    public items: any;
    public searching: any = false;

    constructor(public viewCtrl: ViewController, params: NavParams) {
        this.dataService = params.get('dataService');
        this.keyFieldName = params.get('keyFieldName');
        this.displayFieldName = params.get('displayFieldName');
        this.disabledValue = params.get('disabledValue');
        this.searchControl = new FormControl();
    }

    public ionViewDidLoad() {
        this.setFilteredItems();
        this.searchControl.valueChanges.debounceTime(500).subscribe(() => {
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
        this.viewCtrl.dismiss(id);
    }

    public onCancelSelection() {
        this.viewCtrl.dismiss();
    }
}
