import { Component, OnInit } from '@angular/core';
import { InspectionBuildingPersonRequiringAssistance } from 'src/app/shared/models/inspection-building-person-requiring-assistance';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GenericType } from 'src/app/shared/models/generic-type';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { PersonRequiringAssistanceTypeRepositoryProvider } from 'src/app/core/services/repositories/person-requiring-assistance-type-repository';
import { InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-person-requiring-assistance-type-repository';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-UUID';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-building-pnap-detail',
  templateUrl: './building-pnap-detail.component.html',
  styleUrls: ['./building-pnap-detail.component.scss'],
})
export class BuildingPnapDetailComponent implements OnInit {

  private isNew: boolean = true;
  private idBuildingPnap: string;
  private readonly idBuilding: string;

  public readonly integerPattern: string = '^(0|([1-9]([0-9]*)))$';

  public pnap: InspectionBuildingPersonRequiringAssistance;
  public form: FormGroup;
  public pnapTypes: GenericType[] = [];
  public labels = {};

  constructor(
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private msg: MessageToolsProvider,
    private modalCtrl: ModalController,
    private typeRepo: PersonRequiringAssistanceTypeRepositoryProvider,
    private repo: InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider,
    private navParams: NavParams,
    private translateService: TranslateService
  ) {
    this.idBuilding = this.navParams.get('idBuilding');
    this.idBuildingPnap = this.navParams.get('idBuildingPnap');
    this.isNew = this.idBuildingPnap == null;
    this.createForm();
  }

  async ngOnInit() {
    this.pnapTypes = await this.typeRepo.getAll();
    this.translateService.get([
      'waitFormMessage', 'confirmation', 'pnapDeleteQuestion', 'pnapLeaveMessage'
    ]).subscribe(
      labels => this.labels = labels,
      error => console.log(error));

    const load = await this.loadCtrl.create({ message: this.labels['waitFormMessage'] });
    await load.present();
    try {
      if (this.idBuildingPnap == null) {
        this.createPnap();
      } else {
        this.pnap = await this.repo.get(this.idBuilding, this.idBuildingPnap);
      }

      this.setValuesAndStartListening();
    } finally {
      await load.dismiss();
    }
  }

  private createForm() {
    const regexChecker = (mask: string) => {
      return (control: FormControl) => {
        const value = control.value + '';
        const reg = new RegExp(mask);
        if (reg.test(value)) {
          return null;
        } else {
          return { incorrectValue: true };
        }
      };
    };

    this.form = this.fb.group({
      idPersonRequiringAssistanceType: ['', [Validators.required]],
      dayResidentCount: [0, [Validators.min(0), Validators.max(9999), regexChecker(this.integerPattern)]],
      eveningResidentCount: [0, [Validators.min(0), Validators.max(9999), regexChecker(this.integerPattern)]],
      nightResidentCount: [0, [Validators.min(0), Validators.max(9999), regexChecker(this.integerPattern)]],
      dayIsApproximate: [false, []],
      eveningIsApproximate: [false, []],
      nightIsApproximate: [false, []],

      description: ['', [Validators.maxLength(500)]],
      personName: ['', [Validators.maxLength(60)]],
      floor: ['', [Validators.maxLength(3)]],
      local: ['', [Validators.maxLength(10)]],
      contactName: ['', [Validators.maxLength(60)]],
      contactPhoneNumberMasked: ['', [Validators.maxLength(14), Validators.minLength(14)]],
    });
  }

  private setNumber(fieldName: string, newNumber: string): void {
    this.form.controls[fieldName].patchValue(newNumber, { emitEvent: false });
  }

  private formatPhoneNumber(phone: string): string {
    let area = '';
    let firstThree = '';
    let lastFour = '';
    let result = '(';

    if (phone.length === 0) {
      return '';
    } else if (phone.length < 3) {
      return result + phone;
    } else {
      area += phone.substr(0, 3);
    }

    if (phone.length > 3 && phone.length < 6) {
      firstThree = phone.substr(3, phone.length - 3);
    } else if (phone.length > 3) {
      firstThree = phone.substr(3, 3);
    }

    if (phone.length > 6 && phone.length < 10) {
      lastFour = phone.substr(6, phone.length - 6);
    } else if (phone.length > 6) {
      lastFour = phone.substr(6, 4);
    }

    result += area;
    if (area.length === 3) {
      result += ') ';
    }

    if (firstThree.length < 3) {
      return result + firstThree;
    } else {
      return result + firstThree + '-' + lastFour;
    }
  }


  private setValuesAndStartListening(): void {
    this.setValues();
    this.startWatchingForm();
  }

  private setValues() {
    if (this.pnap != null) {
      this.form.patchValue(this.pnap);
      this.setNumber('contactPhoneNumberMasked', this.formatPhoneNumber(this.pnap.contactPhoneNumber));
    }
  }

  private startWatchingForm() {
    this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => this.saveIfValid());
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      this.saveForm();
    }
  }

  private async saveForm() {
    Object.assign(this.pnap, this.form.value);
    this.pnap.contactPhoneNumber = this.form.value.contactPhoneNumberMasked.replace(/\D+/g, '');
    await this.repo.save(this.pnap);
    this.form.markAsPristine();
    this.isNew = false;
  }

  private createPnap() {
    const data = new InspectionBuildingPersonRequiringAssistance();
    data.id = UUID.UUID();
    data.idBuilding = this.idBuilding;
    data.isActive = true;
    this.idBuildingPnap = data.id;
    this.pnap = data;
  }

  public async onDeletePnap() {
    if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['pnapDeleteQuestion'])) {
      await this.repo.delete(this.pnap);
      await this.modalCtrl.dismiss();
    } else if (this.isNew) {
      await this.modalCtrl.dismiss();
    }
  }

  public async onCancelEdition() {
    if (this.form.dirty || this.isNew) {
      if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['pnapLeaveMessage'])) {
        await this.modalCtrl.dismiss();
      }
    } else {
      await this.modalCtrl.dismiss();
    }
  }
}
