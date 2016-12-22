/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimespanService } from './timespan.service';

describe('TimespanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimespanService]
    });
  });

  it('should ...', inject([TimespanService], (service: TimespanService) => {
    expect(service).toBeTruthy();
  }));
});
