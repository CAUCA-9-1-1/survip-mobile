import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController} from 'ionic-angular';
import {MenuItem} from "../../interfaces/menu-item.interface";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    private rootPage = 'InspectionListPage';
    public menuItems: MenuItem[];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
      this.menuItems = [
          { title: 'Listes des inspections', page:'InspectionListPage', icon:'clipboard' }
      ];
  }
    openPage(page) {
        this.rootPage = page;
    }
}
