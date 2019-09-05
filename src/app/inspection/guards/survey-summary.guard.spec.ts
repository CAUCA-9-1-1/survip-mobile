import { TestBed, async, inject } from '@angular/core/testing';

import { SurveySummaryGuard } from './survey-summary.guard';

describe('SurveyGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurveySummaryGuard]
    });
  });

  it('should ...', inject([SurveySummaryGuard], (guard: SurveySummaryGuard) => {
    expect(guard).toBeTruthy();
  }));
});
