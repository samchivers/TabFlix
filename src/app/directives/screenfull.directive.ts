import { Directive, HostListener } from '@angular/core';
import { SiteService } from '../services/site/site.service';
const screenfull = require('screenfull');

@Directive({
    selector: '[toggleFullscreen]'
})
export class ToggleFullscreenDirective {

    constructor(private _siteService: SiteService) {}

    @HostListener('click') onClick() {
        // Create iFrame for urls to sit in
        this._siteService.createIframeForSites();
        // Toggle fullscreen
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }
}
