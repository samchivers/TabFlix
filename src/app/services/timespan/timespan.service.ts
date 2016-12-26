import { Injectable } from '@angular/core';
import { Site } from '../../models/site.model';
import { Timespan } from '../../models/timespan.model';

@Injectable()
export class TimespanService {

  // Array object for timespan options
  public TimespanArray = Array<Timespan>();

  // Construct an array of Timespans from 10 seconds
  // to 120 seconds
  public constructTimespanArray(): Array<Timespan> {
    for (let i = 1; i <= 12; i++) {
      this.TimespanArray.push(new Timespan(i, i * 10));
    }
    return this.TimespanArray;
  }

}
