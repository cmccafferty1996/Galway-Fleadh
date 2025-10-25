import { TestBed } from '@angular/core/testing';

import { ResultsService } from './results.service';

describe('ResultsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResultsService = TestBed.inject(ResultsService);
    expect(service).toBeTruthy();
  });
});
