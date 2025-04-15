import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-small-hero',
  templateUrl: './small-hero.component.html',
  styleUrls: ['./small-hero.component.scss']
})
export class SmallHeroComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('SmallHero component initialized with component data', this.rendering);
  }
}
