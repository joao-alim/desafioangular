import { TestBed } from '@angular/core/testing';

import { FordApiService } from './ford-api.service';

describe('FordApiService', () => {
  let service: FordApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FordApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
