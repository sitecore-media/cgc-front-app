import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  isMobile: boolean = false;

  constructor() { }

  private checkDeviceType(): void {
    this.isMobile = window.innerWidth <= 768; // Mobile if width <= 768px
  }

  ngOnInit() {
    this.checkDeviceType();
    console.log('NewsDetail component initialized with component data', this.rendering);
  }
}
