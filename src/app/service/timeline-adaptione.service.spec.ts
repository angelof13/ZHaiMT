import { TestBed } from '@angular/core/testing';

import { TimelineAdaptioneService } from './timeline-adaptione.service';

describe('TimelineAdaptioneService', () => {
  let service: TimelineAdaptioneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineAdaptioneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
