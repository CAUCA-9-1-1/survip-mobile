import {Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ModalController, NavParams} from 'ionic-angular';
import {SearchListComponent} from '../search-list/search-list';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {ServiceForListInterface} from '../../interfaces/service-for-list.interface';

/**
 * Generated class for the SearchBoxComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'search-box',
  templateUrl: 'search-box.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBoxComponent),
      multi: true
    }
  ]
})
export class SearchBoxComponent implements ControlValueAccessor, OnChanges, OnInit  {
  ngOnInit(): void {
  }

  selectedItemDescription: string;
  @Input() dataService: ServiceForListInterface;
  @Input() keyFieldName: string;
  @Input() displayFieldName: string;

  @Output() selectedIdChange = new EventEmitter<string>();
  private _currentId: string;

  get currentId() {
    return this._currentId;
  }
  @Input()
  set currentId(val) {
    console.log('rue changée');
    console.log(val);
    this._currentId = val;
    this.showSelectionDescription();
    this.propagateChange(this.currentId);
    this.selectedIdChange.emit(this.currentId);
  }

  propagateChange: any = () => {};
  writeValue(value: any) {
    this.currentId = value;
  }
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}

  constructor(params: NavParams,
              private modalCtrl: ModalController,
              private laneService: LaneRepositoryProvider) {
    this.dataService = params.get('dataService');
    this.keyFieldName = params.get('keyFieldName');
    this.displayFieldName = params.get('displayFieldName');
  }

  ngOnChanges(inputs) {
    this.propagateChange(this.currentId);
  }

  onClick(){
    console.log('clickety click');
  }

  private onSelectionChanged(selectedId: string) {
    this.currentId = selectedId;
    this.selectedIdChange.emit(selectedId);
    this.showSelectionDescription();
  };

  private showSelectionDescription() {
    if (this.currentId == null) {
      this.selectedItemDescription = '';
    } else {
      this.dataService
        .getDescriptionById(this._currentId)
        .subscribe(description => this.selectedItemDescription = description);
    }
  }

  private onPopSearch() {
    console.log("on pop search");
    let profileModal = this.modalCtrl.create(SearchListComponent, {
      dataService: this.laneService,
      keyFieldName: this.keyFieldName,
      displayFieldName: this.displayFieldName
    });
    profileModal.onDidDismiss(data => {
      if (data != null){
        this.onSelectionChanged(data);
      }
    });
    profileModal.present();
  }
}
