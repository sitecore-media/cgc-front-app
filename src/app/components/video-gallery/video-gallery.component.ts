import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit, Input } from "@angular/core";
import { JssContextService } from "../../jss-context.service";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { environment } from "../../../environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-video-gallery",
  templateUrl: "./video-gallery.component.html",
  styleUrls: ["./video-gallery.component.css"],
})
export class VideoGalleryComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  videoList: any[] = [];
  totalItems: number = 0;
  pageNumber = 1;
  pageSize = 10;

  switchTypes: string[] = ["border-all", "list"];
  activeSwitchType: string = this.switchTypes[0];

  isvidOpen = false;
  selectedVideo: any = null;
  safeVideoUrl: SafeResourceUrl | null = null;

  constructor(
    private jssService: JssContextService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    console.log(
      "VideoGallery component initialized with component data",
      this.rendering
    );
    this.getVideoList();
  }

  setActiveSwitchType(type: string): void {
    this.activeSwitchType = type;
  }

  getVideoList(): void {
    const apiUrl = `${environment.sitecoreApiHost}/sitecore/api/layout/render/default`;

    const params = new HttpParams()
      .set("item", "/media-hub/video-gallery")
      .set("page", this.pageNumber)
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
    const videoList =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields
        ?.children;
    const totalVideos =
      response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields
        ?.TotalCount;

    if (Array.isArray(videoList)) {
      this.videoList = videoList.map((video) => ({
        ...video,
        sanitizedVideoUrl: this.getSafeVideoUrl(video), // Store the sanitized URL with new name
      }));
      this.totalItems = totalVideos;
    } else {
      console.error("The expected items array was not found in the response.");
    }
  }

  private handleError(error: any): void {
    console.error("Error fetching video list:", error);
  }

  openVideoPopup(video: any): void {
    if (this.selectedVideo === video) {
      return; // Avoid reloading if the same video is selected
    }

    this.selectedVideo = video;
    this.safeVideoUrl = this.getSafeVideoUrl(video);
    this.isvidOpen = true;
  }

  closeVideoPopup(): void {
    this.isvidOpen = false;
    this.selectedVideo = null;

    // Delay removing the iframe to prevent flickering
    setTimeout(() => {
      this.safeVideoUrl = null;
    }, 300);
  }

  onPageChange(event: any): void {
    this.pageNumber = event.page;
    this.getVideoList();
  }

  getSafeVideoUrl(video: any): SafeResourceUrl {
    if (!video) return "";

    let rawUrl = video.fields.videolink.value;

    // Convert YouTube watch URL to embed format if needed
    if (rawUrl.includes("youtube.com/watch")) {
      const videoId = rawUrl.split("v=")[1].split("&")[0];
      rawUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // const url = video.fields.videolink.value
    // .replace('watch?v=', 'embed/')
    // .split('&')[0];

    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }
}
