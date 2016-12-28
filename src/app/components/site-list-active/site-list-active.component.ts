import { Component, OnInit, EventEmitter } from '@angular/core';
import { SiteService } from '../../services/site/site.service';
import { SiteArray } from '../../models/sitearray.model';
import { Site } from '../../models/site.model';

@Component({
    selector: 'app-site-list-active',
    templateUrl: './site-list-active.component.html',
    styleUrls: ['./site-list-active.component.css']
})
export class SiteListActiveComponent implements OnInit {

    // Object to hold array of Sites
    public siteArray: SiteArray;

    constructor(private _siteService: SiteService) { }

    ngOnInit() {
        this.siteArray = this._siteService.getSites();
        this._siteService.siteAdded$.subscribe(site => this._onSiteAdded(site));
        this._siteService.siteRemoved$.subscribe(site => this._onSiteRemoved(site));
        this._siteService.siteUpdated$.subscribe(site => this._onSiteUpdated(site));
        this._siteService.siteReOrdered$.subscribe(site => this._onSiteReOrdered(site));
    }

    // When a new site is added, refresh the list of 
    // active sites
    private _onSiteAdded(site: Site): void {
        this.siteArray = this._siteService.getSites();
    }

    // Refresh the site list when an existing site is
    // updated to have a new timespan
    private _onSiteUpdated(site: Site): void {
        this.siteArray = this._siteService.getSites();
    }

    // Re-order the site list
    private _onSiteReOrdered(site: Site): void {
        this.siteArray = this._siteService.getSites();
    }

    // When a site is removed, refresh the list of
    // active sites. Separate method to the above
    // in case we want to do something with the 
    // removed site one day
    private _onSiteRemoved(site: Site): void {
        this.siteArray = this._siteService.getSites();
    }

    // Remove a given site from local storage
    public removeSite(site: Site) {
        this._siteService.removeSite(site);
    }

    // Send event to populate site form with
    // given site
    public hydrateSite(site: Site) {
        this._siteService.hydrateSite(site);
    }

    // Handle list rearrangement
    public moveSite(site: Site, direction: string) {
        this._siteService.moveSite(site, direction);
    }

}
