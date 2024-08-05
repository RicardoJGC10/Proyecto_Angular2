import { TestBed } from '@angular/core/testing';

import { BestsellingService } from './bestselling.service';

describe('BestsellingService', () => {
  let service: BestsellingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BestsellingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
