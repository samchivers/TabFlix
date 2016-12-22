import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SiteListComponent } from './components/site-list/site-list.component';
import { SiteComponent } from './components/site/site.component';
import { SiteListActiveComponent } from './components/site-list-active/site-list-active.component';
import { ViewComponent } from './components/view/view.component';
import { FooterComponent } from './components/footer/footer.component';
import { MapToIterable } from './pipes/mapToIterable';
import { SiteService } from './services/site/site.service';
import { TimespanService } from './services/timespan/timespan.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ToggleFullscreenDirective } from './directives/screenfull.directive';

@NgModule({
  declarations: [
    AppComponent,
    SiteListComponent,
    SiteComponent,
    SiteListActiveComponent,
    ViewComponent,
    FooterComponent,
    MapToIterable,
    ToggleFullscreenDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    LocalStorageModule.withConfig({
      prefix: 'tabflix',
      storageType: 'localStorage'
    }),
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  providers: [
    SiteService,
    TimespanService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
