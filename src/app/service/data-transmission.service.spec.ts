import { TestBed } from '@angular/core/testing';

import { DataTransmissionService } from './data-transmission.service';

describe('DataTransmissionService', () => {
  let service: DataTransmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTransmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
