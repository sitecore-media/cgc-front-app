import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-initative-contact-info',
  templateUrl: './initative-contact-info.component.html',
  styleUrls: ['./initative-contact-info.component.scss']
})
export class InitativeContactInfoComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('InitativeContactInfo component initialized with component data', this.rendering);
  }
}
