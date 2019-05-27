import { Component, OnInit } from '@angular/core';
import { Inspection } from 'src/app/shared/interfaces/inspection.interface';
import { InspectionBuildingForList } from 'src/app/shared/models/inspection-building-for-list';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';

@Component({
  selector: 'app-inspection-buildings',
  templateUrl: './inspection-buildings.component.html',
  styleUrls: ['./inspection-buildings.component.scss'],
})
export class InspectionBuildingsComponent implements OnInit {

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

  constructor(private controller: InspectionControllerProvider) {
  }

  ngOnInit() { }

  public getBuildingName(building: InspectionBuildingForList, index) {
    if (building.aliasName != null && building.aliasName !== '') {
      return building.aliasName;
    } else if (building.corporateName != null && building.corporateName !== '') {
      return building.corporateName;
    } else if (building.isMainBuilding) {
      return 'Bâtiment principal';
    } else {
      return 'Bâtiment enfant #' + index;
    }
  }

  public getBuildingDescription(building: InspectionBuildingForList, index) {
    if (building.isMainBuilding) {
      if (this.buildingHasNameOrAlias(building)) {
        return 'Bâtiment principal';
      } else {
        return '';
      }
    } else {
      if (this.buildingHasNameOrAlias(building)) {
        return 'Bâtiment enfant #' + (index);
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
