import { Timespan } from './timespan.model';

// Class to model the site form
export class Site {
    // The address for each tab
    public url: string;
    // The length of time to spend on each tab
    public timespan: Array<Timespan>;
}