import { TestBed } from '@angular/core/testing';

import { UploadDocsService } from './upload-docs.service';

describe('UploadDocsService', () => {
  let service: UploadDocsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadDocsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
