import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-media-system',
  templateUrl: './media-system.component.html',
  styleUrls: ['./media-system.component.scss']
})
export class MediaSystemComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  constructor() { }


  ngOnInit() {
    // remove this after implementation is done
    console.log('MediaSystem component initialized with component data', this.rendering);
  }
 
}
