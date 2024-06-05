import { TestBed } from '@angular/core/testing';

import { AfterResetService } from './after-reset.service';

describe('AfterResetService', () => {
  let service: AfterResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfterResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
