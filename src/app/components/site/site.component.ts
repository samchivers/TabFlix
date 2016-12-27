import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SiteService } from '../../services/site/site.service';
import { TimespanService } from '../../services/timespan/timespan.service';
import { Modal } from 'angular2-modal/plugins/bootstrap/modal';
import { Overlay } from 'angular2-modal';
import { Site } from '../../models/site.model';

@Component({
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

    // Site form
    public form: FormGroup;

    // Array of possible Timespans
    public timespanArray;

    constructor(private _siteService: SiteService,
                private _timespanService: TimespanService,
                public overlay: Overlay,
                public vcRef: ViewContainerRef,
                public modal: Modal) {
        overlay.defaultViewContainer = vcRef;
    }

    ngOnInit() {
        this.buildAddSiteForm();
        this.timespanArray = this._timespanService.constructTimespanArray();
        this._siteService.siteExists$.subscribe(site => this._onSiteExists(site));
    }

    // Show the user a modal with error message
    // when they've tried to add a url that 
    // already exists in local storage
    private _onSiteExists(site: Site): void {
        this.modal.alert()
            .size('sm')
            .isBlocking(true)
            .showClose(false)
            .keyboard(27)
            .title('Error')
            .body('Cannot add a duplicate URL. A site with the same URL already exists. Check the Active Urls list below.')
            .okBtnClass('btn btn-danger')
            .open();
    }

    // Add a new site object to local storage
    // via the site service
    public addSite() {
        this._siteService.saveSite(this.form.value);
    }

    // Build the dynamic form for adding new sites
    public buildAddSiteForm() {
        this.form = this._siteService.getSiteFormGroup();
        console.log(this.form);
    }

}
