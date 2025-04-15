import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-media-hub',
  templateUrl: './media-hub.component.html',
  styleUrls: ['./media-hub.component.css']
})
export class MediaHubComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('MediaHub component initialized with component data', this.rendering);
  }
}
