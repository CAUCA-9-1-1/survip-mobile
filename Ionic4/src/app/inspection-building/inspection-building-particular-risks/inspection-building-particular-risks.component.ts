import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';

@Component({
  selector: 'app-inspection-building-particular-risks',
  templateUrl: './inspection-building-particular-risks.component.html',
  styleUrls: ['./inspection-building-particular-risks.component.scss'],
})
export class InspectionBuildingParticularRisksComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  public get idBuilding(): string {
    return this.controller.currentIdBuilding;
  }

  public currentSegment: string = 'foundation';

  constructor(
    private controller: InspectionControllerProvider) { }

  ngOnInit() {}

}
