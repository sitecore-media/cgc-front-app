import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-initative-training-process',
  templateUrl: './initative-training-process.component.html',
  styleUrls: ['./initative-training-process.component.scss']
})
export class InitativeTrainingProcessComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('InitativeTrainingProcess component initialized with component data', this.rendering);
  }
}
