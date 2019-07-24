import { TestBed, async, inject } from '@angular/core/testing';

import { InspectionBuildingPagesGuard } from './inspection-building-pages.guard';

describe('InspectionBuildingPagesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InspectionBuildingPagesGuard]
    });
  });

  it('should ...', inject([InspectionBuildingPagesGuard], (guard: InspectionBuildingPagesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
