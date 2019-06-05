import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionBuildingHazardousMaterialsComponent } from './inspection-building-hazardous-materials.component';

describe('InspectionBuildingHazardousMaterialsComponent', () => {
  let component: InspectionBuildingHazardousMaterialsComponent;
  let fixture: ComponentFixture<InspectionBuildingHazardousMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionBuildingHazardousMaterialsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionBuildingHazardousMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
