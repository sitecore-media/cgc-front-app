import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-initiative-facts',
  templateUrl: './initiative-facts.component.html',
  styleUrls: ['./initiative-facts.component.scss']
})
export class InitiativeFactsComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('InitiativeFacts component initialized with component data', this.rendering);
  }
}
