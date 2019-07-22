import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';

@Component({
  selector: 'app-inspection-building-anomalies',
  templateUrl: './inspection-building-anomalies.component.html',
  styleUrls: ['./inspection-building-anomalies.component.scss'],
})
export class InspectionBuildingAnomaliesComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  constructor(private controller: InspectionControllerProvider,) { }

  ngOnInit() {}

}
