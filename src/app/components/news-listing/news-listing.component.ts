import { Component, OnInit, Input } from "@angular/core";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { JssContextService } from "../../jss-context.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { dictionaryServiceFactory } from "../../lib/dictionary-service-factory";

@Component({
  selector: "app-news-listing",
  templateUrl: "./news-listing.component.html",
  styleUrls: ["./news-listing.component.scss"],
})
export class NewsListingComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  isMobile: boolean = false;
  newsList: any[] = [];
  totalItems: number = 0;

  dictionary = dictionaryServiceFactory.create();
  ReadMore: string = "";

  pageNumber = 1;
  pageSize = 12;
  language: string = "en";
  switchTypes: string[] = ["border-all", "list"];
  activeSwitchType: string = this.switchTypes[0];
  constructor(
    private jssService: JssContextService,
    private http: HttpClient
  ) { }


  ngOnInit() {

    this.dictionary
      .fetchDictionaryData(this.jssService.stateValue.language)
      .then((data) => {
        console.log("Dictionary Data:", data);
        this.ReadMore = data.ReadMore;
      });

    this.checkDeviceType();
    this.setLanguageFromUrl();
    console.log(
      "news component initialized with component data",
      this.rendering
    );
    this.getNewsList();
  }

  getNewsList(): void {
    const apiUrl =
      `${environment.sitecoreApiHost}/sitecore/api/layout/render/default`;

    const params = new HttpParams()
      .set("item", "/media-hub/news")
      .set("page", this.pageNumber)
      // .set("take", this.pageSize.toString())
      .set("sc_apikey", environment.sitecoreApiKey)
      .set("sc_site", environment.sitecoreSiteName)
      .set("sc_lang", this.jssService.stateValue.language)
      .set("tracking", "true");

    this.http.get(apiUrl, { params }).subscribe({
      next: (response: any) => this.handleNewsListResponse(response),
      error: (error) => this.handleError(error),
    });
  }

  private handleNewsListResponse(response: any): void {
    // Access the newsItems array correctly
    const newsItems = response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.children;
    const allTotalNewsItemsCount = response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.TotalCount;

    console.log("Extracted News Items:", newsItems); // Log the extracted news items
    console.log("Total Items Count:", allTotalNewsItemsCount); // Log the total items count

    if (Array.isArray(newsItems)) {
      this.newsList = newsItems;
      this.totalItems = allTotalNewsItemsCount;
    } else {
      console.error("The expected items array was not found in the response.");
    }
  }

  private handleError(error: any): void {
    console.error("Error fetching search results:", error);
  }

  onPageChange(event: any): void {
    console.log("Page change event:", event); // Debug page change event
    this.pageNumber = event.page;
    this.getNewsList(); // Fetch data for the new page
  }

  getLocalizedPageNumber(page: number): string {
    // Debug localization logic
    console.log("Page number before localization:", page);
    if (this.language === "ar") {
      const localizedNumber = this.convertToArabicNumbers(page.toString());
      console.log("Localized page number:", localizedNumber); // Log localized number
      return localizedNumber;
    }
    return page.toString();
  }

  convertToArabicNumbers(input: string): string {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return input.replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
  }


  private checkDeviceType(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private setLanguageFromUrl(): void {
    const url = window.location.href;
    if (url.includes("/ar-SA/")) {
      this.language = "ar";
    } else {
      this.language = "en";
    }
  }

  setActiveSwitchType(type: string): void {
    this.activeSwitchType = type;
  }

  get totalNews(): number {
    // const latestNewsList = this.rendering?.fields?.latestNewsList;
    const latestNewsList = (this.rendering?.fields?.newsDetailsList as any)?.newsItems;
    return Array.isArray(latestNewsList) ? latestNewsList.length : 0;
  }

  get totalPages(): number {
    return Math.ceil(this.totalNews / this.pageSize);
  }

  get paginatedNews() {
    if (!(this.rendering?.fields?.newsDetailsList as any)?.newsItems) return [];
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    const latestNewsList = (this.rendering?.fields?.newsDetailsList as any)?.newsItems;
    if (Array.isArray(latestNewsList)) {
      return latestNewsList.slice(startIndex, startIndex + this.pageSize);
    }
    return [];
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageNumber = newPage;
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get translatedShowingText(): string {
    const start = (this.pageNumber - 1) * this.pageSize + 1;
    const end = Math.min(this.pageNumber * this.pageSize, this.totalNews);

    if (this.language === "ar") {
      return `عرض ${this.convertToArabicNumbers(start.toString())} إلى ${this.convertToArabicNumbers(
        end.toString()
      )} من ${this.convertToArabicNumbers(this.totalNews.toString())} عناصر الاخبار`;
    } else {
      return `Showing ${start} To ${end} of ${this.totalNews} News Items`;
    }
  }
}



// breadCrumbImage: string = "";
// breadCrumbTitle: string = "";
// breadCrumbPathLinkOne: string = "";
// breadCrumbPathLinkTwo: string = "";
// breadCrumbPathLinkThree: string = "";
// this.breadCrumbImage = breadCrumbImage;
// this.breadCrumbTitle = breadCrumbTitle;
// this.breadCrumbPathLinkOne = breadCrumbPathLinkOne;
// this.breadCrumbPathLinkTwo = breadCrumbPathLinkTwo;
// this.breadCrumbPathLinkThree = breadCrumbPathLinkThree;
// console.log("Breadcrumb Image:", breadCrumbImage);
// console.log("Breadcrumb Title:", breadCrumbTitle);
// const breadCrumbImage = response?.sitecore?.route?.fields?.breadcrumbImage?.value?.src;
// const breadCrumbTitle = response?.sitecore?.route?.fields?.breadcrumbTitle?.value;
// const breadCrumbPathLinkOne = response?.sitecore?.route?.fields?.breadcrumbPathLinkOne?.value;
// const breadCrumbPathLinkTwo = response?.sitecore?.route?.fields?.breadcrumbPathLinkTwo?.value;
// const breadCrumbPathLinkThree = response?.sitecore?.route?.fields?.breadcrumbPathLinkThree?.value;