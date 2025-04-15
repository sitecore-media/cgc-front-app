import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';


@Component({
  selector: 'app-fallback-rendering',
  templateUrl: './fallback-rendering.component.html',
  styleUrls: ['./fallback-rendering.component.scss']
})
export class FallbackRenderingComponent implements OnInit {
  @Input() componentName: string = 'Unknown Component';
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('fallback-rendering component initialized with component data', this.rendering);
  }
}
