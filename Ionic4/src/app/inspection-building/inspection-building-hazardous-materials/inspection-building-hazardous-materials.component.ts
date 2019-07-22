import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';

@Component({
  selector: 'app-inspection-building-hazardous-materials',
  templateUrl: './inspection-building-hazardous-materials.component.html',
  styleUrls: ['./inspection-building-hazardous-materials.component.scss'],
})
export class InspectionBuildingHazardousMaterialsComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  constructor(private controller: InspectionControllerProvider,) { }

  ngOnInit() {}

}
