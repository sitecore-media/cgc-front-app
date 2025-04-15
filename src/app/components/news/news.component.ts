import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  isMobile: boolean = false;

  constructor() { }

  private checkDeviceType(): void {
    this.isMobile = window.innerWidth <= 768; // Mobile if width <= 768px
  }

  ngOnInit() {
    this.checkDeviceType();
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
