import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-initative-image-with-description',
  templateUrl: './initative-image-with-description.component.html',
  styleUrls: ['./initative-image-with-description.component.scss']
})
export class InitativeImageWithDescriptionComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('InitativeImageWithDescription component initialized with component data', this.rendering);
  }
}
