import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchToolComponent } from './sketch-tool.component';

describe('SketchToolComponent', () => {
  let component: SketchToolComponent;
  let fixture: ComponentFixture<SketchToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchToolComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
