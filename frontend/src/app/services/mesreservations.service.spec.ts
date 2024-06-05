import { TestBed } from '@angular/core/testing';

import { MesreservationsService } from './mesreservations.service';

describe('MesreservationsService', () => {
  let service: MesreservationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesreservationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
