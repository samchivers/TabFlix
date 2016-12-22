import { Site } from './site.model';

// Class to model the array of sites
export class SiteArray {
    // Property to hold site arrays
    public siteArray: Array<Site>;
    
    // Initialise property
    constructor(){
        this.siteArray = new Array<Site>();
    }
}