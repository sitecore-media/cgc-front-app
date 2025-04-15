import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-minister-message',
  templateUrl: './minister-message.component.html',
  styleUrls: ['./minister-message.component.scss']
})
export class MinisterMessageComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {

    // remove this after implementation is done
    console.log('MinisterMessage component initialized with component data', this.rendering);
  }
}
