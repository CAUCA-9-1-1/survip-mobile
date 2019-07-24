import { TestBed, async, inject } from '@angular/core/testing';

import { InspectionPagesGuard } from './inspection-pages.guard';

describe('InspectionPagesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InspectionPagesGuard]
    });
  });

  it('should ...', inject([InspectionPagesGuard], (guard: InspectionPagesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
