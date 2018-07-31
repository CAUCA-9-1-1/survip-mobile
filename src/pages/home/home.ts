import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController} from 'ionic-angular';
import {MenuItem} from "../../interfaces/menu-item.interface";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    private rootPage = 'InspectionListPage';
    public menuItems: MenuItem[];
    public labels = {}

  constructor(public navCtrl: NavController, public menuCtrl: MenuController,private translateService: TranslateService) {

  }
    ngOnInit() {
        this.translateService.get([
            'inspectionList'
        ]).subscribe(labels => {
            this.labels = labels;
        });
        this.menuItems = [
            { title: this.labels['inspectionList'], page:'InspectionListPage', icon:'clipboard' }
        ];
    }
    openPage(page) {
        this.rootPage = page;
    }
}
