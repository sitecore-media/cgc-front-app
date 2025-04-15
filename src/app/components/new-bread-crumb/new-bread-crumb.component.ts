import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-new-bread-crumb',
  templateUrl: './new-bread-crumb.component.html',
  styleUrls: ['./new-bread-crumb.component.scss']
})
export class NewBreadCrumbComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('NewBreadCrumb component initialized with component data', this.rendering);
  }
}
