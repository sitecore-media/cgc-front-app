import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { HttpClient } from '@angular/common/http';
import { JssContextService } from "../../jss-context.service";
import { environment } from "../../../environments/environment";


@Component({
  selector: 'app-shared-title-and-icons',
  templateUrl: './shared-title-and-icons.component.html',
  styleUrls: ['./shared-title-and-icons.component.css']
})
export class SharedTitleAndIconsComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  readingTime: string = '';
  lastUpdated: string = '';
  dictionaryData: any = {};

  readingTimeLable = 'loading ...';
  lastUpdatedLable = 'loading ...';
  constructor(private http: HttpClient, private jssService: JssContextService, ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    this.jssService.state.subscribe((state) => {
      
      const pageId = state.sitecore.route.itemId as string;
      // const title= state.sitecore.route.fields.title.value as string;
      
      this.fetchReadingInfo(pageId, state.language);
    });
  }
  fetchReadingInfo(pageId: string, language: string): void {

    const apiUrl = `${environment.sitecoreApiHost}/api/ratings/get-page-views?pageId=${pageId}&title=${language}`;

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

}
