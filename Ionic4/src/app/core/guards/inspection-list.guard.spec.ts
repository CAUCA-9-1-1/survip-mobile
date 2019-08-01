import { TestBed, async, inject } from '@angular/core/testing';

import { InspectionListGuard } from './inspection-list.guard';

describe('InspectionListGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InspectionListGuard]
    });
  });

  it('should ...', inject([InspectionListGuard], (guard: InspectionListGuard) => {
    expect(guard).toBeTruthy();
  }));
});
