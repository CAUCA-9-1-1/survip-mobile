import { Component, OnInit } from '@angular/core';
import { Inspection } from 'src/app/shared/interfaces/inspection.interface';
import { InspectionBuildingForList } from 'src/app/shared/models/inspection-building-for-list';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inspection-buildings',
  templateUrl: './inspection-buildings.component.html',
  styleUrls: ['./inspection-buildings.component.scss'],
})
export class InspectionBuildingsComponent implements OnInit {

  private labels: string[];

  public get currentInspection(): Inspection {
    return this.controller.currentInspection;
  }

  public get buildings(): InspectionBuildingForList[] {
    if (this.controller.inspection == null || this.controller.inspection.buildings == null) {
      return [];
    } else {
      return this.controller.inspection.buildings;
    }
  }

  constructor(
    private controller: InspectionControllerProvider,
    private translateService: TranslateService) {

    this.translateService.get(['childBuilding', 'parentBuilding']).subscribe(
      labels => this.labels = labels,
      error => console.log(error));
  }

  ngOnInit() { }

  public getBuildingName(building: InspectionBuildingForList, index) {
    if (building.aliasName != null && building.aliasName !== '') {
      return building.aliasName;
    } else if (building.corporateName != null && building.corporateName !== '') {
      return building.corporateName;
    } else if (building.isMainBuilding) {
      return this.labels['parentBuilding'];
    } else {
      return this.labels['childBuilding'] + ' #' + index;
    }
  }

  public getBuildingDescription(building: InspectionBuildingForList, index) {
    if (building.isMainBuilding) {
      if (this.buildingHasNameOrAlias(building)) {
        return this.labels['parentBuilding'];
      } else {
        return '';
      }
    } else {
      if (this.buildingHasNameOrAlias(building)) {
        return this.labels['childBuilding'] + ' #' + index;
      } else {
        return '';
      }
    }
  }

  private buildingHasNameOrAlias(building: InspectionBuildingForList) {
    return (building.aliasName != null && building.aliasName !== '')
      || (building.corporateName != null && building.corporateName !== '');
  }
}
