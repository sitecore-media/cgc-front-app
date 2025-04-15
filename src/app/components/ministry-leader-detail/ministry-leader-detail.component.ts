import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-ministry-leader-detail',
  templateUrl: './ministry-leader-detail.component.html',
  styleUrls: ['./ministry-leader-detail.component.scss']
})
export class MinistryLeaderDetailComponent implements OnInit {
  @Input() rendering: ComponentRendering;
    // Define two new arrays
    firstTwoDescriptions: any[] = [];
    remainingDescriptions: any[] = [];

  constructor() { }

  ngOnInit() {
    // Split the array into two parts
    if (Array.isArray(this.rendering?.fields?.descriptionSection)) {
      this.firstTwoDescriptions = this.rendering.fields.descriptionSection.slice(0, 2); // First two elements
      this.remainingDescriptions = this.rendering.fields.descriptionSection.slice(2); // Remaining elements
    }
}
}