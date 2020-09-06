import { TestBed } from '@angular/core/testing';

import { ShadeService } from './shade.service';

describe('ShadeService', () => {
  let service: ShadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
