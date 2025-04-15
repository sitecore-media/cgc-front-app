import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-all-news-listing',
  templateUrl: './all-news-listing.component.html',
  styleUrls: ['./all-news-listing.component.scss']
})
export class AllNewsListingComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('news component initialized with component data', this.rendering);
  }


  page = 1;
  switchTypes: string[] = ['border-all', 'list']; // Array to hold switch types
  activeSwitchType: string = this.switchTypes[0]; // Default active switch type
  setActiveSwitchType(type: string): void {
    this.activeSwitchType = type;
  }
}
