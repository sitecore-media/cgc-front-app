import { Component, OnInit, Input } from "@angular/core";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { JssContextService } from "../../jss-context.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-media-leaders",
  templateUrl: "./media-leaders.component.html",
  styleUrls: ["./media-leaders.component.scss"],
})
export class MediaLeadersComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  reversedLanguage: string = ""; // Reversed language
  currentLanguage: string = ""; // Current language
  // Define two new arrays
  firstTwoLeaders: any[] = [];
  remainingLeaders: any[] = [];
  isContactOpen = false;
  selectedLeader: any = null; // Track the selected leader
  sectionTitle: any;

  constructor(
    private jssService: JssContextService,
    private http: HttpClient
  ) {}

  toggleContact(leader: any) {
    this.selectedLeader = leader; // Set the selected leader
    this.isContactOpen = !!leader; // Open the popup if a leader is selected
  }

  ngOnInit() {
    this.getCurrentLang();

    // Split the array into two parts
    if (Array.isArray(this.rendering?.fields?.items)) {
      this.firstTwoLeaders = this.rendering.fields.items.slice(0, 2); // First two elements
      this.remainingLeaders = this.rendering.fields.items.slice(2); // Remaining elements
    }

    // remove this after implementation is done
    console.log(
      "MediaLeaders component initialized with component data",
      this.rendering
    );
    //this.getSearchResults();
  }

  getCurrentLang(): void {
    const apiUrl =
      `${environment.sitecoreApiHost}/sitecore/api/layout/render/default`;

    const params = new HttpParams()
      .set("item", "/the-ministry/media-leaders")
      // .set("take", this.pageSize.toString())
      .set("sc_apikey", environment.sitecoreApiKey)
      .set("sc_site", environment.sitecoreSiteName)
      .set("sc_lang", this.jssService.stateValue.language)
      .set("tracking", "Information");

    this.http.get(apiUrl, { params }).subscribe({
      next: (response: any) => this.handleTitleResults(response),
      error: (error) => this.handleError(error),
    });
    // Normalize language to lowercase and handle both "ar-sa" and "ar-SA"
    const detectedLanguage = this.jssService.stateValue.language

    // Ensure consistency in comparison
    this.currentLanguage = detectedLanguage === "ar-sa" || detectedLanguage === "ar-SA".toLowerCase() ? "ar-sa" : "en";

    // Set the reversed language accordingly
    this.reversedLanguage = this.currentLanguage === "ar-sa" ? "en" : "ar-sa";


  }

  generateDynamicHref(baseHref: string | undefined): string {
    if (!baseHref) {
      return "#"; // Return '#' if the link is undefined
    }
    // Construct the dynamic URL with the current language
    const updatedHref = `/${this.currentLanguage}${baseHref}`;
    return updatedHref;
  }

  private handleTitleResults(response: any): void {

    const searchMore = response?.sitecore?.route?.fields?.title?.value;

    this.sectionTitle = searchMore;
  }

  private handleError(error: any): void {
    console.error("Error fetching search results:", error);
  }
}