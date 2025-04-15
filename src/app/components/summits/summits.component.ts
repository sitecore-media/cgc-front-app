// Component
import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { environment } from "../../../environments/environment";
import { JssContextService } from "../../jss-context.service";
import { HttpClient, HttpParams } from "@angular/common/http";

@Component({
  selector: "app-summits",
  templateUrl: "./summits.component.html",
  styleUrls: ["./summits.component.css"],
})
export class SummitsComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  currentSummitVideoUrl: SafeResourceUrl | null = null;
  summitList: any[] = [];
  currentSummit: any = null;
  totalItems: number = 0;
  pageNumber = 1;
  pageSize = 10;

  constructor(
    private jssService: JssContextService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getSummitList();
  }

  getSummitList(): void {
    const apiUrl = `${environment.sitecoreApiHost}/sitecore/api/layout/render/default`;

    const params = new HttpParams()
      .set("item", "/media-hub/summits")
      .set("page", this.pageNumber)
      .set("sc_apikey", environment.sitecoreApiKey)
      .set("sc_site", environment.sitecoreSiteName)
      .set("sc_lang", this.jssService.stateValue.language)
      .set("tracking", "true");

    this.http.get(apiUrl, { params }).subscribe({
      next: (response: any) => this.handleSummitListResponse(response),
      error: (error) => this.handleError(error),
    });
  }

  private handleSummitListResponse(response: any): void {
    const children =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields
        ?.children;
    const totalCount =
      Number(
        response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields
          ?.TotalCount
      ) || 0;

    if (Array.isArray(children)) {
      // Find current live summit
      this.currentSummit = children.find(
        (summit) => summit.fields.IsCurrent?.value === true
      );

      // If a current summit exists, extract the video URL
      if (this.currentSummit?.fields?.videolink?.value) {
        this.currentSummitVideoUrl = this.getSafeVideoUrl(this.currentSummit);
      }

      // Filter out current summit from the list
      this.summitList = children
        .filter((summit) => summit !== this.currentSummit)
        .map((summit) => ({
          ...summit,
          sanitizedVideoUrl: this.getSafeVideoUrl(summit), // Store the sanitized URL with new name
        }));

      // Adjust total count for pagination
      this.totalItems = this.currentSummit ? totalCount - 1 : totalCount;
    } else {
      console.error("Invalid response format");
    }

    console.log("Summit List:", this.summitList);
    console.log("Current Summit:", this.currentSummit);
    console.log("Total Items:", this.totalItems);
  }

  getSafeVideoUrl(summit: any): SafeResourceUrl {
    if (!summit?.fields?.videolink?.value) return "";

    // Convert YouTube URL to embed format
    const url = summit.fields.videolink.value
      .replace("watch?v=", "embed/")
      .split("&")[0];

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private handleError(error: any): void {
    console.error("Error fetching summit list:", error);
  }

  onPageChange(event: any): void {
    this.pageNumber = event.page;
    this.getSummitList();
  }
}
