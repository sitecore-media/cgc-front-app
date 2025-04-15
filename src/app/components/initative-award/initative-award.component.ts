import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-initative-award',
  templateUrl: './initative-award.component.html',
  styleUrls: ['./initative-award.component.scss']
})
export class InitativeAwardComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('InitativeAward component initialized with component data', this.rendering);
  }
  
}

