import { Component, Input, AfterViewInit } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { HttpClient } from '@angular/common/http';
import { JssContextService } from "../../jss-context.service";
import { environment } from "../../../environments/environment";
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-reading-info',
  templateUrl: './reading-info.component.html',
  styleUrls: ['./reading-info.component.css']
})
export class ReadingInfoComponent implements AfterViewInit {
  @Input() rendering: ComponentRendering;
  readingTime: string = '';
  lastUpdated: string = '';
  dictionaryData: any = {};

  readingTimeLable = 'loading ...';
  lastUpdatedLable = 'loading ...';
  constructor(private http: HttpClient, private jssService: JssContextService, private globalService: GlobalService
  ) {
    this.translate();

  }

  ngAfterViewInit(): void {
    this.jssService.state.subscribe((state) => {
      const pageId = state.sitecore.route.itemId as string;
      this.fetchReadingInfo(pageId, state.language);
    });
  }



  fetchReadingInfo(pageId: string, language: string): void {

    const apiUrl = `${environment.sitecoreApiHost}/api/ratings/get-page-views?pageId=${pageId}&language=${language}`;

    this.http.get<{ PageReading: number; LastModifiedDate: string }>(apiUrl).subscribe({
      next: (data) => {
        this.readingTime = data.PageReading.toString();
        this.lastUpdated = new Date(data.LastModifiedDate).toLocaleString();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.readingTime = 'N/A';
        this.lastUpdated = 'N/A';
      }
    });
  }

  translate(): void {
    this.dictionaryData = this.globalService.getDictionaryData(this.jssService.stateValue.language).then((data) => {
      this.dictionaryData = data;
      this.readingTimeLable = this.dictionaryData["ratings.pagecount"];
      this.lastUpdatedLable = this.dictionaryData["ratings.modifeddate"];
    });
  }


}
