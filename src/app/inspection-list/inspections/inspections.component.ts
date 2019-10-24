import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'src/app/shared/interfaces/menu-item.interface';
import { TranslateService } from '@ngx-translate/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.component.html',
  styleUrls: ['./inspections.component.scss'],
})
export class InspectionsComponent implements OnInit {

  public menuItems: MenuItem[];
  public labels = {};

  constructor(
    private menuController: MenuController,
    private translateService: TranslateService) {
    }

  ngOnInit() {
    this.translateService.get([
      'inspectionList'
    ]).subscribe(labels => {
      this.labels = labels;
    });
    this.menuItems = [{
      title: this.labels['inspectionList'],
      page: 'InspectionListPage',
      icon: 'clipboard',
      enabled: true
    }];
  }

  ionViewWillEnter() {
    const menuid = 'inspection-list-menu';
    this.menuController.enable(true, menuid);
  }
}
