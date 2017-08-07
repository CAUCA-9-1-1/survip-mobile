import {Component, OnDestroy, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ModalController} from 'ionic-angular';
import {ServiceForListInterface} from '../../interfaces/service-for-list.interface';
import {SearchListComponent} from '../search-list/search-list';

/**
 * Generated class for the SearchBoxComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'search-box',
  templateUrl: 'search-box.html',
  providers:[
    {provide: NG_VALUE_ACCESSOR, useExisting: SearchBoxComponent, multi: true}
  ]
})
export class SearchBoxComponent implements ControlValueAccessor, OnDestroy{
  private isLoading: boolean;
  private isDisposed: boolean = false;
  private innerValue: string;
  private changed = new Array<(value: string) => void>();
  private touched = new Array<() => void>();
  private selectedItemDescription: string;

  @Input() dataService: ServiceForListInterface;
  @Input() keyFieldName: string;
  @Input() displayFieldName: string;
  @Input() description: string;

  constructor(private modalCtrl: ModalController) {
  }

  ngOnDestroy(): void {
    this.isDisposed = true;
  }

  get value(): string {
    return this.innerValue;
  }

  set value(value: string) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.changed.forEach(f => f(value));
      this.showSelectionDescription();
    }
  }

  touch() {
    this.touched.forEach(f => f());
  }

  writeValue(value: string) {
    if (!this.isDisposed) { // this is a patch to fix an issue where some ghost instance of this component would exist in memory and would be linked to the same formGroup somehow.
      this.innerValue = value;
      this.showSelectionDescription();
    }
  }

  registerOnChange(fn: (value: string) => void) {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

  private onPopSearch() {
    let profileModal = this.modalCtrl.create(SearchListComponent, {
      dataService: this.dataService,
      keyFieldName: this.keyFieldName,
      displayFieldName: this.displayFieldName
    });
    profileModal.onDidDismiss(data => {
      if (data != null){
        this.value = data;
      }
    });
    profileModal.present();
  }

  private showSelectionDescription() {
    this.isLoading = true;
    if (this.innerValue == null) {
      this.selectedItemDescription = '';
      this.isLoading = false;
    } else {
      this.dataService
        .getDescriptionById(this.innerValue)
        .subscribe(description => {
          this.selectedItemDescription = description;
          this.isLoading = false;
        });
    }
  }
}
