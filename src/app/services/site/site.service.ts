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

    // Event emitted when a site that already
    // exists is added
    public siteExists$: EventEmitter<Site>;

    constructor(private _formBuilder: FormBuilder,
        private _timespanService: TimespanService,
        private _localStorageService: LocalStorageService) {
        this.siteAdded$ = new EventEmitter<Site>();
        this.siteRemoved$ = new EventEmitter<Site>();
        this.siteExists$ = new EventEmitter<Site>();
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
                this.siteExists$.emit(site);
                return;
            }
        }

        // Add the given site to the array
        this._siteArray.siteArray.push(site);

        // Save the array and emit an event 
        // to hook into elsewhere
        this._localStorageService.set('siteArray', this._siteArray);
        this.siteAdded$.emit(site);
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
            timespan: [site.timespan || '', Validators.required]
        });
    }

    // Create the full size iFrame that will cycle through the
    // site array urls and add it to the body element
    public createIframeForSites(): void {
        let siteArray = this.getSites();

        let reverseArray = siteArray;
        reverseArray.siteArray.reverse();
        let index = 0;

        for (let site of reverseArray.siteArray) {
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

    // Cycle through the sites in the SitesArray, changing the
    // url each time
    public cycleThroughSites(): void {
        let sites = this.getSites();
        if (sites.siteArray !== null) {
            let index = 0;
            // Cycle through sites
            let timer = setInterval(() => {
                for (let site in sites.siteArray) {
                    if (site !== null) {
                        let iframe = document.getElementById('tabflix-iframe-' + index);
                        if (iframe !== null) {
                            let active = iframe.getAttribute('tabflix') === 'active' ? 1 : 0;
                            if (active) {
                                // Remove active status
                                iframe.setAttribute('tabflix', '');
                                // Set next frame to active
                                let nextIndex = (index + 1 === sites.siteArray.length) ? 0 : index + 1;
                                let nextIframe = document.getElementById('tabflix-iframe-' + nextIndex);
                                nextIframe.setAttribute('tabflix', 'active');
                                nextIframe.style.zIndex = '2000';
                                // Set Z-Index of original iFrame
                                iframe.style.zIndex = '1000';
                            }
                        }
                    }
                }
                ((index + 1) === sites.siteArray.length) ? index = 0 : index++;
            }, 10000);
        }
    }

}
