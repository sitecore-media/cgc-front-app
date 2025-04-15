// import { Component, OnInit, Input } from "@angular/core";
// import { ActivatedRoute } from "@angular/router";
// import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
// import { JssContextService } from "../../jss-context.service";
// import { HttpClient, HttpParams } from "@angular/common/http";
// import { environment } from "../../../environments/environment";

// @Component({
//   selector: "app-search-results",
//   templateUrl: "./search-results.component.html",
//   styleUrls: ["./search-results.component.scss"],
// })
// export class SearchResultsComponent implements OnInit {
//   @Input() rendering: ComponentRendering;
//   searchKeyword: string | null = null;
//   searchResults: any[] = [];
//   totalItems: number = 0;
//   pageNumber = 1;
//   pageSize = 10;
//   language: string = "en";

//   constructor(
//     private route: ActivatedRoute,
//     private jssService: JssContextService,
//     private http: HttpClient
//   ) {}

//   ngOnInit() {
//     this.setLanguageFromUrl();
//     // Get search keyword from query params
//     this.route.queryParams.subscribe((params) => {
//       this.searchKeyword = params["q"];
//     });
//     // Fetch search results based on the keyword
//     this.getSearchResults();
//   }

//   getSearchResults(): void {
//     const apiUrl =
//       "http://cd.mom.dev/sitecore/api/layout/render/default";

//     const params = new HttpParams()
//       .set("item", "search")
//       .set("q", this.searchKeyword || "")
//       .set("page", this.pageNumber.toString())
//       // .set("take", this.pageSize.toString())
//       .set("sc_apikey", environment.sitecoreApiKey)
//       .set("sc_site", environment.sitecoreSiteName)
//       .set("sc_lang", this.jssService.stateValue.language)
//       .set("tracking", "Information");

//     this.http.get(apiUrl, { params }).subscribe({
//       next: (response: any) => this.handleSearchResults(response),
//       error: (error) => this.handleError(error),
//     });
//   }

//     onPageChange(newPage: number): void {
//     this.pageNumber = newPage;
//     this.getSearchResults(); // Reload search results for the new page
//   }

//   get totalNews(): number {
//     const latestSearchResults = this.searchResults;
//     return Array.isArray(latestSearchResults) ? latestSearchResults.length : 0;
//   }

//   get totalPages(): number {
//     return Math.ceil(this.totalNews / this.pageSize);
//   }

//   get paginatedNews() {
//     if (!this.searchResults) return [];
//     const startIndex = (this.pageNumber - 1) * this.pageSize;
//     const latestSearchResults = this.searchResults;
//     if (Array.isArray(latestSearchResults)) {
//       return latestSearchResults.slice(startIndex, startIndex + this.pageSize);
//     }
//     return [];
//   }

//   changePage(newPage: number): void {
//       this.pageNumber = newPage;
//       this.getSearchResults();
//   }

//   getPages(): number[] {
//     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   convertToArabicNumbers(input: string): string {
//     const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
//     return input.replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
//   }

//   get translatedShowingText(): string {
//     const start = (this.pageNumber - 1) * this.pageSize + 1;
//     const end = Math.min(this.pageNumber * this.pageSize, this.totalNews);

//     if (this.language === "ar") {
//       return `عرض ${this.convertToArabicNumbers(
//         start.toString()
//       )} إلى ${this.convertToArabicNumbers(
//         end.toString()
//       )} من ${this.convertToArabicNumbers(
//         this.totalNews.toString()
//       )} عناصر البحث`;
//     } else {
//       return `Showing ${start} To ${end} of ${this.totalNews} Search Items`;
//     }
//   }

//   private handleSearchResults(response: any): void {
//     const items =
//       response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.items;

//     if (Array.isArray(items)) {
//       this.searchResults = items;
//       this.totalItems = items.length;
//       console.log("Extracted Items:", items);
//     } else {
//       console.error("The expected items array was not found.");
//     }
//   }

//   private handleError(error: any): void {
//     console.error("Error fetching search results:", error);
//   }

//   private setLanguageFromUrl(): void {
//     const url = window.location.href;
//     if (url.includes("/ar-SA/")) {
//       this.language = "ar";
//     } else {
//       this.language = "en";
//     }
//   }
// }

import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { JssContextService } from "../../jss-context.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.css"],
})
export class SearchResultsComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  searchKeyword: string | null = null;
  searchResults: any[] = [];
  totalItems: number = 0;
  pageNumber = 1;
  pageSize = 10;
  language: string = "en";

  SearchFor: any;
  SearchFound: any;
  More: any;

  constructor(
    private route: ActivatedRoute,
    private jssService: JssContextService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.setLanguageFromUrl();
    // Get search keyword from query params
    this.route.queryParams.subscribe((params) => {
      this.searchKeyword = params["q"];
    });
    // Fetch search results based on the keyword
    this.getSearchResults();
  }

  getSearchResults(): void {
    const apiUrl =
      `${environment.sitecoreApiHost}/sitecore/api/layout/render/default`;

    const params = new HttpParams()
      .set("item", "search")
      .set("q", this.searchKeyword || "")
      .set("page", this.pageNumber)
      // .set("take", this.pageSize.toString())
      .set("sc_apikey", environment.sitecoreApiKey)
      .set("sc_site", environment.sitecoreSiteName)
      .set("sc_lang", this.jssService.stateValue.language)
      .set("tracking", "Information");

    this.http.get(apiUrl, { params }).subscribe({
      next: (response: any) => this.handleSearchResults(response),
      error: (error) => this.handleError(error),
    });
  }

  onPageChange(event: any): void {
    this.pageNumber = event.page;
    this.getSearchResults(); // Reload search results for the new page
  }

  get totalNews(): number {
    const latestSearchResults = this.searchResults;
    return Array.isArray(latestSearchResults) ? latestSearchResults.length : 0;
  }

  get paginatedNews() {
    if (!this.searchResults) return [];
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    const latestSearchResults = this.searchResults;
    if (Array.isArray(latestSearchResults)) {
      return latestSearchResults.slice(startIndex, startIndex + this.pageSize);
    }
    return [];
  }

  convertToArabicNumbers(input: string): string {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return input.replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
  }

  get translatedShowingText(): string {
    const start = (this.pageNumber - 1) * this.pageSize + 1;
    const end = Math.min(this.pageNumber * this.pageSize, this.totalItems);

    if (this.language === "ar") {
      return `عرض ${this.convertToArabicNumbers(
        start.toString()
      )} إلى ${this.convertToArabicNumbers(
        end.toString()
      )} من ${this.convertToArabicNumbers(
        this.totalItems.toString()
      )} عناصر البحث`;
    } else {
      return `Showing ${start} To ${end} of ${this.totalItems} Search Items`;
    }
  }

  private handleSearchResults(response: any): void {
    const items =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.items;
    const allTotalItemsCount = response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.totalSearchResults;
    const searchMore = response?.sitecore?.route?.fields?.searchTitle?.value;
    const searcResultFor = response?.sitecore?.route?.fields?.searchShortDescription?.value;
    const searchResultFound = response?.sitecore?.route?.fields?.searchText?.value;

    this.SearchFor = searcResultFor;
    this.SearchFound = searchResultFound;
    this.More = searchMore;

    console.log("SearchFor:", searcResultFor);
    console.log("SearchFound:", searchResultFound);
    if (Array.isArray(items)) {
      this.searchResults = items;
      this.totalItems = allTotalItemsCount;
      // this.SearchFor = searcResultFor;
      //  this.SearchFound = searcResultFound;
      console.log("Extracted Items:", items);
      console.log("SearchFor:", searcResultFor);
      console.log("SearchFound:", searchResultFound);
    } else {
      console.error("The expected items array was not found.");
    }
  }

  private handleError(error: any): void {
    console.error("Error fetching search results:", error);
  }

  private setLanguageFromUrl(): void {
    const url = window.location.href;
    if (url.includes("/ar-SA/")) {
      this.language = "ar";
    } else {
      this.language = "en";
    }
  }
}





































// import { Component, OnInit, Input } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
// import { JssContextService } from '../../jss-context.service';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { environment } from '../../../environments/environment';

// @Component({
//   selector: 'app-search-results',
//   templateUrl: './search-results.component.html',
//   styleUrls: ['./search-results.component.css'],
// })
// export class SearchResultsComponent implements OnInit {
//   @Input() rendering: ComponentRendering;
//   searchKeyword: string | null = null;
//   searchResults: any[] = [];
//   totalItems: number = 0;
//   pageNumber = 1;
//   pageSize = 3;
//   language: string = 'en';

//   constructor(
//     private route: ActivatedRoute,
//     private jssService: JssContextService,
//     private http: HttpClient
//   ) {}

//   ngOnInit() {
//     // Set language from URL if exists
//     this.setLanguageFromUrl();

//     // Get search keyword from query params
//     this.route.queryParams.subscribe((params) => {
//       this.searchKeyword = params['q'];
//     });

//     // Fetch search results based on the keyword
//     this.getSearchResults();
//   }

//   private setLanguageFromUrl(): void {
//     const url = window.location.href;
//     if (url.includes("/ar-SA/")) {
//       this.language = "ar";
//     } else {
//       this.language = "en";
//     }
//   }

//   getSearchResults(): void {
//     const apiUrl = 'http://cd.mom.dev/sitecore/api/layout/render/default';

//     const params = new HttpParams()
//       .set('item', 'search')
//       .set('q', this.searchKeyword || '')
//       .set('page', this.pageNumber.toString())
//       .set('take', this.pageSize.toString())
//       .set('sc_apikey', environment.sitecoreApiKey)
//       .set('sc_site', environment.sitecoreSiteName)
//       .set('sc_lang', this.jssService.stateValue.language)
//       .set('tracking', 'true');

//     this.http.get(apiUrl, { params }).subscribe({
//       next: (response: any) => this.handleSearchResults(response),
//       error: (error) => this.handleError(error),
//     });
//   }

//   private handleSearchResults(response: any): void {
//     const items = response?.sitecore?.route?.placeholders?.['jss-main']?.[0]?.fields?.items;

//     if (Array.isArray(items)) {
//       this.searchResults = items;
//       this.totalItems = items.length;
//     } else {
//       console.error('The expected items array was not found.');
//     }
//   }

//   private handleError(error: any): void {
//     console.error('Error fetching search results:', error);
//   }

//   get totalPages(): number {
//     return Math.ceil(this.totalItems / this.pageSize);
//   }

//   changePage(newPage: number): void {
//     if (newPage >= 1 && newPage <= this.totalPages) {
//       this.pageNumber = newPage;
//       this.getSearchResults(); // Fetch new page results
//     }
//   }

//   getPages(): number[] {
//     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   convertToArabicNumbers(input: string): string {
//     const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
//     return input.replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)] || digit);
//   }

//   get translatedShowingText(): string {
//     const start = (this.pageNumber - 1) * this.pageSize + 1;
//     const end = Math.min(this.pageNumber * this.pageSize, this.totalItems);

//     if (this.language === "ar") {
//       return `عرض ${this.convertToArabicNumbers(start.toString())} إلى ${this.convertToArabicNumbers(
//         end.toString()
//       )} من ${this.convertToArabicNumbers(this.totalItems.toString())} عناصر البحث`;
//     } else {
//       return `Showing ${start} To ${end} of ${this.totalItems} Search Results`;
//     }
//   }
// }
