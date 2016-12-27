import { Component, OnInit } from '@angular/core';

import { SiteComponent } from '../site/site.component';

@Component({
    selector: 'app-site-list',
    templateUrl: './site-list.component.html',
    styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit {

    // Show warning regarding mixed content?
    public showGithubPagesWarning: boolean;

    constructor() { }

    ngOnInit() {
        if (window.location.href.indexOf('github.io') > 0) {
            this.showGithubPagesWarning = true;
        } else {
            this.showGithubPagesWarning = false;
        }
    }


}
