import { TestBed } from '@angular/core/testing';

import { FrequencyService } from './frequency.service';

describe('FrequencyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrequencyService = TestBed.get(FrequencyService);
    expect(service).toBeTruthy();
  });
});
