import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-media-service-detail',
  templateUrl: './media-service-detail.component.html',
  styleUrls: ['./media-service-detail.component.css']
})
export class MediaServiceDetailComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('MediaServiceDetail component initialized with component data', this.rendering);
  }
}
