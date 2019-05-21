import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements ControlValueAccessor {
  private changed = new Array<(value: string) => void>();

  @Input() dataSource: [{}];
  @Input() title: string;

  public selectedValue: string = '';

  constructor() { }

  get value(): string {
    return this.selectedValue;
  }

  set value(value: string) {
    if (this.selectedValue !== value) {
      this.selectedValue = value;
      this.changed.forEach(f => f(value));
    }
  }

  public clearSelectedValue() {
    this.value = '';
  }

  public registerOnChange(fn: (value: string) => void) {
    this.changed.push(fn);
  }

  public registerOnTouched(fn: () => void) {
  }

  writeValue(value: any): void {

    this.selectedValue = value ? value : '';
  }

  public selectedItemChanged(e) {
    if ((e ? e : '') !== this.selectedValue) {
      this.value = e;
    }
  }
}
