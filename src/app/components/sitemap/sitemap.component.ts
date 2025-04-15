import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('Sitemap component initialized with component data', this.rendering);
  }

 
}
