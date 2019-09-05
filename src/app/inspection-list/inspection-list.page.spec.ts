import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionListPage } from './inspection-list.page';

describe('InspectionListPage', () => {
  let component: InspectionListPage;
  let fixture: ComponentFixture<InspectionListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
