import {Component, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'custom-select',
    templateUrl: 'custom-select.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: CustomSelectComponent, multi: true}
    ]
})

export class CustomSelectComponent implements ControlValueAccessor {
    @Input() dataSource: [{}];
    @Input() title: string;
    private changed = new Array<(value: string) => void>();
    public selectedValue: string = '';

    constructor() {
    }

    get value(): string {
        return this.selectedValue;
    }

    set value(value: string) {
        if(this.selectedValue !== value) {
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

    public selectedItemChanged(e){
        if((e ? e : '') != this.selectedValue) {
            this.value = e;
        }
    }
}