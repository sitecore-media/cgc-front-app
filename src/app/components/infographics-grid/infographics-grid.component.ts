import { Component, OnInit, Input } from "@angular/core";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { Lightbox } from "ngx-lightbox";
import { dictionaryServiceFactory } from "../../lib/dictionary-service-factory";
import { JssContextService } from "../../jss-context.service";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

interface MediaItem {
  src: string;
  title: string;
  thumb: string;
  link?: string;
  alt?: string;
}

@Component({
  selector: "app-infographics-grid",
  templateUrl: "./infographics-grid.component.html",
  styleUrls: ["./infographics-grid.component.css"],
})
export class InfographicsGridComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  album: MediaItem[] = [];
  dictionary = dictionaryServiceFactory.create();
  More: string = "";

  infographicsItemsList: any[] = [];
  totalItems: number = 0;

  pageNumber = 1;
  pageSize = 10;
  language: string = "en";
  switchTypes: string[] = ["border-all", "list"];
  activeSwitchType: string = this.switchTypes[0];

  constructor(
    private lightbox: Lightbox,
    private jssService: JssContextService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getInfographicsList();
    this.dictionary
      .fetchDictionaryData(this.jssService.stateValue.language)
      .then((data: any) => {
        console.log("Dictionary Data infografic:", data);
        this.More = data.ReadMore;
        console.log("this.More=", this.More)
      });
  }

  getInfographicsList(): void {
    const apiUrl = `${environment.sitecoreApiHost}/sitecore/api/layout/render/default`;

    const params = new HttpParams()
      .set("item", "/media-hub/infographic")
      .set("page", this.pageNumber.toString())
      .set("sc_apikey", environment.sitecoreApiKey)
      .set("sc_site", environment.sitecoreSiteName)
      .set("sc_lang", this.jssService.stateValue.language)
      .set("tracking", "true");

    this.http.get(apiUrl, { params }).subscribe({
      next: (response: any) => this.handleInfographicsListResponse(response),
      error: (error) => this.handleError(error),
    });
  }

  private handleInfographicsListResponse(response: any): void {
    const infographicsItems =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.mediaData?.MediaResultModels;
    const infographicsItemsCount =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.mediaData?.TotalCount;

    if (Array.isArray(infographicsItems)) {
      this.infographicsItemsList = infographicsItems;
      this.totalItems = infographicsItemsCount;

      // Map infographicsItemsList to album
      this.album = this.infographicsItemsList.map((item: any) => ({
        src: item.Image || "",
        title: item.Title || "",
        thumb: item.ThumbnailUrl || "",
        link: item.Link || "",
        alt: item.Title || "Infographic image",
      }));
    } else {
      console.error("The expected items array was not found in the response.");
    }
  }

  private handleError(error: any): void {
    console.error("Error fetching infographics:", error);
  }

  onPageChange(event: any): void {
    console.log("Page change event:", event);
    this.pageNumber = event.page;
    this.getInfographicsList();
  }

  open(index: number): void {
    const lightboxAlbum = this.album.map((img) => ({
      src: img.src,
      caption: `<div class='lightbox-header'>
                  <h3>${img.title}</h3>
                </div>`,
      thumb: img.thumb,
    }));

    this.lightbox.open(lightboxAlbum, index, {
      centerVertically: false,
      disableScrolling: true,
    });
  }

  close(): void {
    this.lightbox.close();
  }
}
