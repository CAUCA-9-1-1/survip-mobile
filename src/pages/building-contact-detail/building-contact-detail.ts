import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {BuildingContactRepositoryProvider} from '../../providers/repositories/building-contact-repository';
import {InspectionBuildingContact} from '../../models/inspection-building-contact';
import {UUID} from 'angular2-uuid';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-building-contact-detail',
    templateUrl: 'building-contact-detail.html',
})
export class BuildingContactDetailPage {
    private idBuildingContact: string;
    private readonly idBuilding: string;
    private subscription: ISubscription;

    public isNew: boolean = false;
    public contact: InspectionBuildingContact;
    public form: FormGroup;
    public labels = {};

    constructor(
        private fb: FormBuilder,
        private loadCtrl: LoadingController,
        private repo: BuildingContactRepositoryProvider,
        private msg: MessageToolsProvider,
        public navCtrl: NavController,
        public viewCtrl: ViewController,
        public navParams: NavParams,
        private translateService: TranslateService) {

        this.idBuilding = navParams.get("idBuilding");
        this.idBuildingContact = navParams.get('idBuildingContact');
        this.isNew = this.idBuildingContact == null;
        this.createForm();
    }

    public ngOnInit() {
        this.translateService.get([
            'waitFormMessage','confirmation','contactDeleteQuestion','contactLeaveMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    private setNumber(fieldName: string, newNumber: string): void {
        this.form.controls[fieldName].patchValue(newNumber, {emitEvent: false});
    }

    private formatPhoneNumber(phone: string): string {
        let area = "";
        let firstThree = "";
        let lastFour = "";
        var result = "(";

        if (phone.length == 0)
            return "";
        else if (phone.length < 3)
            return result + phone;
        else
            area += phone.substr(0, 3);

        if (phone.length > 3 && phone.length < 6)
            firstThree = phone.substr(3, phone.length - 3);
        else if (phone.length > 3)
            firstThree = phone.substr(3, 3);

        if (phone.length > 6 && phone.length < 10)
            lastFour = phone.substr(6, phone.length - 6);
        else if (phone.length > 6)
            lastFour = phone.substr(6, 4);

        result += area;
        if (area.length == 3)
            result += ") ";

        if (firstThree.length < 3)
            return result + firstThree;
        else
            return result + firstThree + '-' + lastFour;
    }

    public async ionViewDidEnter() {
        let load = this.loadCtrl.create({'content': this.labels['waitFormMessage']});
        await load.present();
        try {


          if (this.idBuildingContact == null) {
            this.createContact();
          }
          else {
            const data = await this.repo.get(this.idBuildingContact);
            this.contact = data;
          }
          this.setValuesAndStartListening();
        } finally {
          await load.dismiss();
        }
    }

    private createForm() {
        this.form = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(30), this.noWhitespaceValidator]],
            lastName: ['', [Validators.required, Validators.maxLength(30), this.noWhitespaceValidator]],
            callPriority: [0, [Validators.required, Validators.pattern('[0-9]+')]],
            phoneNumberMasked: ['', [Validators.maxLength(14)]],
            phoneNumberExtension: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+'), Validators.min(0)]],
            pagerNumberMasked: ['', [Validators.maxLength(14)]],
            pagerCode: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
            cellphoneNumberMasked: ['', [Validators.maxLength(14)]],
            otherNumberMasked: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
            otherNumberExtension: ['', [Validators.maxLength(14)]],
            isOwner: [false, Validators.required],
        });
    }

    public noWhitespaceValidator(control: FormControl) {
        let isWhitespace = (control.value || '').trim().length === 0;
        let isValid = !isWhitespace;
        return isValid ? null : {'whitespace': true}
    }

    private setValuesAndStartListening(): void {
        this.setValues();
        this.startWatchingForm();
    }

    private setValues() {
        if (this.contact != null) {
            this.form.patchValue(this.contact);
            this.setNumber('phoneNumberMasked', this.formatPhoneNumber(this.contact.phoneNumber));
            this.setNumber('pagerNumberMasked', this.formatPhoneNumber(this.contact.pagerNumber));
            this.setNumber('otherNumberMasked', this.formatPhoneNumber(this.contact.otherNumber));
            this.setNumber('cellphoneNumberMasked', this.formatPhoneNumber(this.contact.cellphoneNumber));
        }
    }

    private startWatchingForm() {
        this.subscription = this.form.valueChanges
            .debounceTime(500)
            .subscribe(() => this.saveIfValid());
    }

    private saveIfValid() {
        if (this.form.valid && this.form.dirty)
            this.saveForm();
    }

    private async saveForm() {
        const formModel = this.form.value;
        Object.assign(this.contact, formModel);
        this.contact.phoneNumber = this.form.value.phoneNumberMasked.replace(/\D+/g, "")
        this.contact.cellphoneNumber = this.form.value.cellphoneNumberMasked.replace(/\D+/g, "")
        this.contact.otherNumber = this.form.value.otherNumberMasked.replace(/\D+/g, "")
        this.contact.pagerNumber = this.form.value.pagerNumberMasked.replace(/\D+/g, "")
        await this.repo.save(this.contact);
        this.form.markAsPristine();
        this.isNew = false;
    }

    private createContact() {
        let data = new InspectionBuildingContact();
        data.id = UUID.UUID();
        data.idBuilding = this.idBuilding;
        this.idBuildingContact = data.id;
        this.contact = data;
    }

    public async onDeleteContact() {
        if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['contactDeleteQuestion'])) {
            await this.repo.delete(this.idBuildingContact);
            this.viewCtrl.dismiss();
        }
        else if (this.isNew) {
            this.viewCtrl.dismiss();
        }
    }

    public async onCancelEdition() {
        if (this.form.dirty || this.isNew) {
            if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['contactLeaveMessage']))
                this.viewCtrl.dismiss();
        }
        else
            this.viewCtrl.dismiss();
    }
}
