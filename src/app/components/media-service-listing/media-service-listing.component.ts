import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-media-service-listing',
  templateUrl: './media-service-listing.component.html',
  styleUrls: ['./media-service-listing.component.css']
})
export class MediaServiceListingComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('MediaServiceListing component initialized with component data', this.rendering);
  }
}
