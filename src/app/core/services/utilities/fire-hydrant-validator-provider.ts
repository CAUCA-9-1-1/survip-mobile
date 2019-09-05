import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class FireHydrantValidatorProvider {

    constructor(public http: HttpClient) {
    }

    rateMeasuringUnitValidator(fireHydrant: FormGroup) {
        return (control: FormGroup) => {
            if (fireHydrant != null
                && (fireHydrant.controls['rateTo'].value > 0 || fireHydrant.controls['rateFrom'].value > 0)
                && (control.value == null || control.value === '')) {
                return {missingUnitOfMeasure: true};
            }
            return null;
        };
    }

    pressureMeasuringUnitValidator(fireHydrant: FormGroup) {
        return (control: FormGroup) => {
            if (fireHydrant != null
                && (fireHydrant.controls['pressureFrom'].value > 0 || fireHydrant.controls['pressureTo'].value > 0)
                && (control.value == null || control.value === '')) {
                return {missingUnitOfMeasure: true};
            }
            return null;
        };
    }
}
