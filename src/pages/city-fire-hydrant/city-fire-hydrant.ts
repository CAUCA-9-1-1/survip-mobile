import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CityFireHydrantForList} from "../../models/city-fire-hydrant-for-list";
import {BuildingFireHydrantRepositoryProvider} from "../../providers/repositories/building-fire-hydrant-repository";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";

@IonicPage()
@Component({
    selector: 'page-city-fire-hydrant',
    templateUrl: 'city-fire-hydrant.html',
})
export class CityFireHydrantPage {

    public cityFireHydrants: CityFireHydrantForList[] = [];
    public filteredCityFireHydrantList: CityFireHydrantForList[] = [];
    private idBuilding: string;
    private idCity = "";
    public editMode = false;
    public editModeColor = "whitesmoke";

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private controller: BuildingFireHydrantRepositoryProvider,
                private messageTools: MessageToolsProvider) {
        this.idBuilding = this.navParams.get('idBuilding');
        this.idCity = navParams.get('idCity');
        this.LoadCityFireHydrant();

    }

    private getItems(ev: any) {
        this.filteredCityFireHydrantList = [];
        let val = ev.target.value;

        if (val && val.trim() != '') {
            this.filteredCityFireHydrantList = this.cityFireHydrants.filter((item) => {
                return ((item.address.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.number.toLowerCase().indexOf(val.toLowerCase()) > -1));
            });
        } else {
            this.filteredCityFireHydrantList = this.cityFireHydrants;
        }
    }

    private LoadCityFireHydrant() {
        this.controller.getCityFireHydrantListForBuilding(this.idCity, this.idBuilding)
            .subscribe(result => {
                this.cityFireHydrants = this.filteredCityFireHydrantList = result
            });

    }

    private AddBuildingFireHydrant(idFireHydrant: string) {
        if(!this.editMode) {
            this.controller.addBuildingFireHydrant(this.idBuilding, idFireHydrant)
                .subscribe(result => {
                    this.navCtrl.pop();
                }, error1 => {
                    this.messageTools.showToast("Erreur lors de l'ajout de borne " + error1);
                })
        }else{
            this.navCtrl.push('FireHydrantPage', {id: idFireHydrant, idCity: this.idCity});
        }
    }

    public createFireHydrant(){
        this.navCtrl.push('FireHydrantPage', {idCity: this.idCity});
    }

    public onEditModeChanged(){
        this.editMode = !this.editMode;
        if(!this.editMode){
            this.editModeColor = "white";
        }else{
            this.editModeColor = "#B32017";
        }
    }
}
