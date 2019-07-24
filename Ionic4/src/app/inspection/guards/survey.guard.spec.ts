import { TestBed, async, inject } from '@angular/core/testing';

import { SurveyGuard } from './survey.guard';

describe('SurveyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurveyGuard]
    });
  });

  it('should ...', inject([SurveyGuard], (guard: SurveyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
