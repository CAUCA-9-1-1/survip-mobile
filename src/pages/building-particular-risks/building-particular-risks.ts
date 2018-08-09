import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-building-particular-risks',
    templateUrl: 'building-particular-risks.html',
})
export class BuildingParticularRisksPage {

    private readonly name: string;

    public readonly idBuilding: string;
    public currentSegment: string = "foundation";

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams) {

        this.idBuilding = navParams.get('idBuilding');
        this.name = navParams.get('name');
    }
}
