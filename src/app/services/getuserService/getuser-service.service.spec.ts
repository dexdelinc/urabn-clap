import { TestBed } from '@angular/core/testing';

import { GetuserServiceService } from './getuser-service.service';

describe('GetuserServiceService', () => {
  let service: GetuserServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetuserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
