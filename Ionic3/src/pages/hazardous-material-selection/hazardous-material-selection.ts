import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {HazardousMaterialRepositoryProvider} from '../../providers/repositories/hazardous-material-repository';
import {HazardousMaterialForList} from '../../models/hazardous-material-for-list';

@IonicPage()
@Component({
    selector: 'page-hazardous-material-selection',
    templateUrl: 'hazardous-material-selection.html',
})
export class HazardousMaterialSelectionPage {
    public searchTerm: string = "";
    public hazardousMaterials: HazardousMaterialForList[] = [];

    constructor(
        private matRepo: HazardousMaterialRepositoryProvider,
        private viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams) {

        this.matRepo.getFiltered(this.searchTerm.trim())
          .then(materials => this.hazardousMaterials = materials);
    }

    public onSearch() {
        this.matRepo.getFiltered(this.searchTerm.trim())
          .then(materials => this.hazardousMaterials = materials);
    }

    public onSelectMaterial(material: HazardousMaterialForList) {
        this.viewCtrl.dismiss({'hasSelected': true, 'selectedMaterial': material});
    }

    public onCancel() {
        this.viewCtrl.dismiss({'hasSelected': false});
    }
}
