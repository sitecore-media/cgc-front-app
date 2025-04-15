import { Component, Input, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutServiceContextData } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements AfterContentInit {
  @Input() errorContextData: LayoutServiceContextData;
  constructor(private router: Router) {

  }
  ngAfterContentInit(): void {

    this.router.navigateByUrl(`/${this.errorContextData.context.language}/404`);


  }



}
