import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { JssContextService } from "../../jss-context.service";

@Component({
  selector: 'app-report-listing',
  templateUrl: './report-listing.component.html',
  styleUrls: ['./report-listing.component.css']
})
export class ReportListingComponent implements OnInit {
  @Input() rendering: ComponentRendering;
 setlang:string="";
  constructor(private jssService: JssContextService) { }
  page = 1;
  switchTypes: string[] = ['border-all', 'list']; // Array to hold switch types
  activeSwitchType: string = this.switchTypes[0]; // Default active switch type
  setActiveSwitchType(type: string): void {
    this.activeSwitchType = type;
  }
  ngOnInit() {
    this.setlang=this.jssService?.stateValue?.language || "en";
    // remove this after implementation is done
    console.log('ReportListing component initialized with component data', this.rendering);
  }
  
}
