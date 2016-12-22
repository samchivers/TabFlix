import { Component, OnInit, Directive, HostListener } from '@angular/core';

const screenfull = require('screenfull');

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
}
