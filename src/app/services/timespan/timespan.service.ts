import { Injectable } from '@angular/core';
import { Site } from '../../models/site.model';
import { Timespan } from '../../models/timespan.model';
import { AppConfig } from '../../app.config';

@Injectable()
export class TimespanService {

    // Array object for timespan options
    public TimespanArray = Array<Timespan>();

    public constructor(private _config: AppConfig) { }

    // Construct an array of Timespans using the
    // min, max and increment values from the config
    // file
    public constructTimespanArray(): Array<Timespan> {

        // Retrieve and parse config settings from
        // config.json file in the src dir
        let timespanConfig = this._config.getConfig('timespans');
        let minTimeValue: number = timespanConfig.min;
        let maxTimeValue: number = timespanConfig.max;
        let incrementValue: number = timespanConfig.increment;

        // How many values will this result in?
        let noOfValues: number = Math.round(((maxTimeValue - minTimeValue) / incrementValue)) + 1;

        // Construct array of choices
        for (let i = 1; i <= noOfValues; i++) {
            this.TimespanArray.push(new Timespan(i, minTimeValue * i));
        }

        return this.TimespanArray;
    }

}
