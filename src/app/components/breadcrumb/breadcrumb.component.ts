import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('Breadcrumb component initialized with component data', this.rendering);
  }



  getImageUrl(): string {
    let breadCrumbData: any = this.rendering?.fields?.breadCrumbData;
    const breadcrumbImage = breadCrumbData?.fields?.breadcrumbImage;
    // Check if breadcrumbImage is null, undefined, or an empty string
    if (!breadcrumbImage) {
      // console.log('No image found for breadcrumb', breadCrumbData);
      // Return a default image path or placeholder if breadcrumbImage is falsy
      return 'assets/img/media/bn-bg.svg';
    } else {
      // Return the actual breadcrumbImage if it's not falsy
      return breadcrumbImage;
    }
  }
}
