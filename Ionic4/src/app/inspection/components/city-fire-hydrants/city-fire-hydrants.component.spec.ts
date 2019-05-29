import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityFireHydrantsComponent } from './city-fire-hydrants.component';

describe('CityFireHydrantsComponent', () => {
  let component: CityFireHydrantsComponent;
  let fixture: ComponentFixture<CityFireHydrantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityFireHydrantsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityFireHydrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
