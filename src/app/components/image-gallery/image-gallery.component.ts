import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { Lightbox } from 'ngx-lightbox';
import { JssContextService } from "../../jss-context.service";
import { environment } from "../../../environments/environment";
// import { Meta } from '@angular/platform-browser';

import { dictionaryServiceFactory } from "../../lib/dictionary-service-factory";

interface MediaItem {
  Image: string;
  Link: string;
  Title: string;
  IsMainPage?: string;
  IsShown?: string;
  Description : string;
  Date : string;
  Category : string;
  ThumbnailUrl : string;
}
interface FilterItem {
  Name: string;
  Id: string;

}


@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  album: MediaItem[] = [];
  categories: FilterItem[] = [];
  readMore: string = "";
  selectedCategory: string = ''; 
  SelectAll:string="";
  imageItemsList: any[] = [];
  totalItems: number = 0;
  categoryItemsList: any[] = [];

  pageNumber = 1;
  pageSize = 10;
  language: string = "en";
  switchTypes: string[] = ["border-all", "list"];
  activeSwitchType: string = this.switchTypes[0];
 dictionary = dictionaryServiceFactory.create();

  constructor(
    private lightbox: Lightbox,
    private jssService: JssContextService,
    private http: HttpClient,
    // private meta: Meta
  ) {}

  setActiveSwitchType(type: string): void {
    this.activeSwitchType = type;
  }

  ngOnInit() {
    this.getImagesList();
    this.dictionary
    .fetchDictionaryData(this.jssService.stateValue.language)
    .then((data:any) => {
      console.log("Dictionary Data Images:", data);
      this.SelectAll = data.SelectAll;
      console.log("this.SelectAll=",this.SelectAll)
    });
    console.log('Category component initialized with component data', this.rendering);
  }

  getImagesList(): void {
    const apiUrl = `${environment.sitecoreApiHost}/sitecore/api/layout/render/default`;

    const params = new HttpParams()
      .set("item", "/media-hub/images")
      .set("page", this.pageNumber.toString())
      .set("sc_apikey", environment.sitecoreApiKey)
      .set("sc_site", environment.sitecoreSiteName)
      .set("sc_lang", this.jssService.stateValue.language)
      .set("tracking", "true");

    this.http.get(apiUrl, { params }).subscribe({
      next: (response: any) => this.handleImagesListResponse(response),
      error: (error) => this.handleError(error),
    });
  }

  private handleImagesListResponse(response: any): void {
    const imagesItems =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.mediaData?.MediaResultModels;
    const imagesItemsCount =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.mediaData?.TotalCount;
    const categoryItems =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.mediaData?.categoryEntities;
    const readMoreItem =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.mediaData?.LinkText;
      // const MetaDescription =
      // response?.sitecore?.route?.fields?.MetaDescription?.value;

      // // if (metaKeywords?.value) {
      // //   this.meta.setMetaTag('keywords', metaKeywords.value);
      // // }
    
      // // Set meta description
      // if (MetaDescription) {
      //   this.meta.updateTag({ name: 'description', content: MetaDescription });      }

    if (Array.isArray(imagesItems)) {
      this.imageItemsList = imagesItems;
      this.totalItems = imagesItemsCount;
      this.categoryItemsList = categoryItems;
      this.readMore = readMoreItem;

      this.categories = this.categoryItemsList.map((item: any) => ({
        Name: item.Name,
        Id: item.Id,
      }));

      this.album = this.imageItemsList.map((item: any) => ({
        Image: item.Image,
        Link: item.Link,
        Title: item.Title,
        IsMainPage: item.IsMainPage,
        IsShown: item.IsShown,
        Description: item.Description,
        Date: item.Data,
        Category: item.Category,
        ThumbnailUrl: item.ThumbnailUrl,
      }));
    } else {
      console.error("The expected items array was not found in the response.");
    }
  }

  private handleError(error: any): void {
    console.error("Error fetching images:", error);
  }

  onPageChange(event: any): void {
    console.log("Page change event:", event);
    this.pageNumber = event.page;
    this.getImagesList();
  }

  filterItems(item: MediaItem): boolean {
    if (!this.selectedCategory) {
      return true;
    }
    return item.Category === this.selectedCategory;
  }

  open(index: number): void {
    const lightboxAlbum = this.album.map((img) => ({
      src: img.Image,
      caption: `<div class='lightbox-header'>
                  <h3>${img.Title}</h3>
                </div>`,
      thumb: img.ThumbnailUrl,
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

