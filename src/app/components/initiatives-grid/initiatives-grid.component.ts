import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-initiatives-grid',
  templateUrl: './initiatives-grid.component.html',
  styleUrls: ['./initiatives-grid.component.scss']
})
export class InitiativesGridComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('InitiativesGrid component initialized with component data', this.rendering);
  }
}
