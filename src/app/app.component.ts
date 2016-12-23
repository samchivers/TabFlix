import { Component } from '@angular/core';
import { SiteListComponent } from './components/site-list/site-list.component';
import './rxjs-operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TabFlix';
}
