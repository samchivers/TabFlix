import { Injectable, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Site } from '../../models/site.model';
import { SiteArray } from '../../models/sitearray.model';
import { TimespanService } from '../../services/timespan/timespan.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class SiteService {

    // Array object that holds all
    // the sites
    private _siteArray: SiteArray;

    // Event emitted when a site is added
    public siteAdded$: EventEmitter<Site>;

    // Event emitted when a site is removed
    public siteRemoved$: EventEmitter<Site>;

    // Event emitted when a site is removed
    public siteUpdated$: EventEmitter<Site>;

    // Event emitted when a site is removed
    public siteReOrdered$: EventEmitter<Site>;

    // Hydrate a site
    public siteToHydrate$: EventEmitter<Site>;

    // Event emitted when a site that already
    // exists is added
    public siteExists$: EventEmitter<Site>;

    constructor(private _formBuilder: FormBuilder,
        private _timespanService: TimespanService,
        private _localStorageService: LocalStorageService) {
        this.siteAdded$ = new EventEmitter<Site>();
        this.siteRemoved$ = new EventEmitter<Site>();
        this.siteUpdated$ = new EventEmitter<Site>();
        this.siteReOrdered$ = new EventEmitter<Site>();
        this.siteExists$ = new EventEmitter<Site>();
        this.siteToHydrate$ = new EventEmitter<Site>();
    }

    // Issue hydration event
    public hydrateSite(site: Site) {
        this.siteToHydrate$.emit(site);
    }

    // Save a new site
    public saveSite(site: Site) {
        // Get current array of sites
        this._siteArray = this.getSites();

        // Check is has values or new it up if not
        if (this._siteArray === undefined || this._siteArray === null) {
            this._siteArray = new SiteArray();
        }

        // Check to see if this URL already exists, do not
        // add it if so
        for (let i = 0; i < this._siteArray.siteArray.length; i++) {
            if (this._siteArray.siteArray[i].url === site.url) {
                if (this._siteArray.siteArray[i].timespan === site.timespan && this._siteArray.siteArray[i].name === site.name) {
                    this.siteExists$.emit(site);
                    return;
                } else {
                    // URL's match but timespan's dont, must be updating
                    // timespan
                    this.updateSite(site);
                    return;
                }
            }
        }

        // Add the given site to the array
        this._siteArray.siteArray.push(site);

        // Save the array and emit an event 
        // to hook into elsewhere
        this._localStorageService.set('siteArray', this._siteArray);
        this.siteAdded$.emit(site);
    }

    // Update an existing site
    public updateSite(site: Site) {
        this._siteArray = this._localStorageService.get('siteArray') as SiteArray;
        for (let i = 0; i < this._siteArray.siteArray.length; i++) {
            if (this._siteArray.siteArray[i].url === site.url) {
                // Remove previous entry and add new one in its place
                this._siteArray.siteArray.splice(i, 1);
                this._siteArray.siteArray.splice(i, 0, site);
                // Save it and emit update event
                this._localStorageService.set('siteArray', this._siteArray);
                this.siteUpdated$.emit(site);
            }
        }
    }

    // Remove a site from LocalStorageService
    public removeSite(site: Site) {
        // Get the current array of sites
        this._siteArray = this.getSites();
        // Remove it if the url matches the url of the site
        // passed in for deletion
        for (let i = 0; i < this._siteArray.siteArray.length; i++) {
            if (this._siteArray.siteArray[i].url === site.url) {
                this._siteArray.siteArray.splice(i, 1);
                this._localStorageService.set('siteArray', this._siteArray);
                this.siteRemoved$.emit(site);
            }
        }
    }

    // Reorder site list
    public moveSite(site: Site, direction: string) {
        let i = this._getIndexOfSite(site);
        this._siteArray = this.getSites();
        if (i !== null) {
            this._siteArray.siteArray.splice(i, 1);
            if (direction === 'up') {
                // decrement index by one
                this._siteArray.siteArray.splice(i - 1, 0, site);
            } else if (direction === 'down') {
                // increment index by one
                this._siteArray.siteArray.splice(i + 1, 0, site);
            }
            this._localStorageService.set('siteArray', this._siteArray);
            this.siteReOrdered$.emit(site);
        }
    }

    // Retrieve Sites
    public getSites(): SiteArray {
        if (this._localStorageService.get('siteArray')) {
            return this._localStorageService.get('siteArray') as SiteArray;
        }
        return new SiteArray();
    }

    // Create Site form
    public getSiteFormGroup(site?: Site) {
        if (site === undefined) {
            site = new Site();
        }
        return this._formBuilder.group({
            url: [site.url || '', Validators.required],
            timespan: [site.timespan || '', Validators.required],
            name: [site.name || '', Validators.required]
        });
    }

    // Create the full size iFrame that will cycle through the
    // site array urls and add it to the body element
    public createIframeForSites(): void {
        let sites = this.getSites();
        let index = 0;

        for (let site of sites.siteArray) {
            let iframe = document.createElement('iframe');

            let zIndex = (index === 0) ? 1000 : (index * 1000) + 1000;
            let zIndexString = zIndex.toString();

            iframe.setAttribute('id', 'tabflix-iframe-' + index);
            iframe.setAttribute('src', site.url);
            iframe.setAttribute('frameborder', 'no');
            iframe.style.position = 'absolute';
            iframe.style.zIndex = '1000';
            iframe.style.top = '0';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.overflow = 'hidden';
            iframe.scrolling = 'no';
            if (index === 0) {
                iframe.setAttribute('tabflix', 'active');
                // Start the first site out as active, and
                // with the highest Z index
                iframe.style.zIndex = '2000';
            }
            document.body.insertBefore(iframe, document.body.childNodes[0]);

            index++;
        }

        this.cycleThroughSites();
    }

    // Get the next site from the SitesArray
    public getNextSite(currentSiteUrl: string): Site {
        let sites = this.getSites();
        let index = 0;

        // Establish the index of the current site
        for (let site of sites.siteArray) {
            if (site.url === currentSiteUrl) {
                break;
            }
            index++;
        }

        // Work out whether it's the last index, in 
        // which case go back to the start, or if not
        // go to the next site
        if (index + 1 === sites.siteArray.length) {
            return sites.siteArray[0];
        } else {
            return sites.siteArray[index + 1];
        }
    }

    // Cycle through the sites in the SitesArray every
    // second to see if a change between sites needs to
    // be made
    public cycleThroughSites(): void {
        let loopTimer = 1;
        let arrayLength = this.getSites().siteArray.length;

        let timer = setInterval(() => {
            // DEBUG to see loop times
            // console.log('loopTimer: ' + loopTimer);

            // Check which site is active
            let activeSite = this._getActiveSite();

            // Stop timer if user has exited
            // iframe screen, and therfore iframes
            // have been removed
            if (activeSite === null) {
                clearTimeout(timer);
                return;
            }

            // Check if incremented interval == site.timespan
            if (Number(activeSite.timespan) === loopTimer) {
                let siteIndex = this._getIndexOfSite(activeSite);
                this._setIframeAttributes(siteIndex, arrayLength);
                loopTimer = 1;
            } else {
                loopTimer += 1;
            }
        }, 1000);
    }

    // Get the site that's currently active 
    private _getActiveSite(): Site {
        let allSites = this.getSites();
        for (let i = 0; i < allSites.siteArray.length; i++) {
            let iframe = document.getElementById('tabflix-iframe-' + i);
            // If user has closed iframes then they
            // will not be found
            if (iframe === null) {
                return null;
            } else {
                let active = iframe.getAttribute('tabflix') === 'active' ? 1 : 0;
                if (active) {
                    return allSites.siteArray[i];
                }
            }
        }
    }

    // Get the index value of a given site
    private _getIndexOfSite(site: Site): number {
        let allSites = this.getSites();
        for (let i = 0; i < allSites.siteArray.length; i++) {
            if (allSites.siteArray[i].url === site.url) {
                return i;
            }
        }
    }

    // Make necessary changes to iframe 
    private _setIframeAttributes(index: number, arrayLength: number) {
        let iframe = document.getElementById('tabflix-iframe-' + index);
        if (iframe !== null) {
            // Remove active status of current iframe
            iframe.setAttribute('tabflix', '');
            // Set next iframe to active
            let nextIndex = (index + 1 === arrayLength) ? 0 : index + 1; // Handle end of array
            let nextIframe = document.getElementById('tabflix-iframe-' + nextIndex);
            nextIframe.setAttribute('tabflix', 'active');
            nextIframe.style.zIndex = '2000';
            // Set Z-Index of original iframe to lower than new one
            iframe.style.zIndex = '1000';
        }
    }

}
