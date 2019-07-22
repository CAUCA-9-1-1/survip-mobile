import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';

@Component({
  selector: 'app-inspection-building-pnaps',
  templateUrl: './inspection-building-pnaps.component.html',
  styleUrls: ['./inspection-building-pnaps.component.scss'],
})
export class InspectionBuildingPnapsComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  constructor(private controller: InspectionControllerProvider,) { }

  ngOnInit() {}

}
