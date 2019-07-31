import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ServiceForListInterface } from '../../interfaces/service-for-list.interface';
import { ModalController } from '@ionic/angular';
import { SearchListComponent } from '../search-list/search-list.component';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: SearchBoxComponent, multi: true }
  ]
})
export class SearchBoxComponent implements ControlValueAccessor, OnDestroy {
  private isDisposed: boolean = false;
  private innerValue: string;
  private changed = new Array<(value: string) => void>();
  private touched = new Array<() => void>();

  public selectedItemDescription: string;
  public isLoading: boolean;

  @Input() dataService: ServiceForListInterface;
  @Input() keyFieldName: string;
  @Input() displayFieldName: string;
  @Input() description: string;
  @Input() showDescription: boolean = true;
  @Input() hasValidationError: boolean;
  @Input() isDisabled: boolean = false;
  @Input() disabledValue: string;

  constructor(private modalCtrl: ModalController) { }


  public ngOnDestroy(): void {
    this.isDisposed = true;
    this.changed = new Array<(value: string) => void>();
    this.touched = new Array<() => void>();
  }

  get value(): string {
    return this.innerValue;
  }

  set value(value: string) {
    if (this.innerValue !== value && !this.isDisposed) {
      this.innerValue = value;
      this.changed.forEach(f => f(value));
      this.showSelectionDescription();
    }
  }

  public touch() {
    this.touched.forEach(f => f());
  }

  public writeValue(value: string) {
    if (!this.isDisposed) {
      // this is a patch to fix an issue where some ghost instance of this component would exist
      // in memory and would be linked to the same formGroup somehow.
      this.innerValue = value;
      this.showSelectionDescription();
    }
  }

  public registerOnChange(fn: (value: string) => void) {
    this.changed.push(fn);
  }

  public registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

  public async onPopSearch() {
    const profileModal = await this.modalCtrl.create({
        component: SearchListComponent,
        componentProps: {
          dataService: this.dataService,
          keyFieldName: this.keyFieldName,
          displayFieldName: this.displayFieldName,
          disabledValue: this.disabledValue
        }
    });
    profileModal.present();

    const returnedValue = await profileModal.onDidDismiss();
    this.value = returnedValue.data;
  }

  private showSelectionDescription() {
    this.isLoading = true;
    if (!this.innerValue) {
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

  public clearSelectedValue() {
    event.stopPropagation();
    this.value = '';
  }
}
