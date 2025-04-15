import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-ministry-media',
  templateUrl: './ministry-media.component.html',
  styleUrls: ['./ministry-media.component.scss']
})
export class MinistryMediaComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('MinistryMedia component initialized with component data', this.rendering);
  }
 

}
