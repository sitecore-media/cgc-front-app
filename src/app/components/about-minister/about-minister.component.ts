import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-about-minister',
  templateUrl: './about-minister.component.html',
  styleUrls: ['./about-minister.component.scss']
})
export class AboutMinisterComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('AboutMinister component initialized with component data', this.rendering);
  }
}
