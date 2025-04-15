import { OnInit, Input, AfterViewInit, Renderer2 } from "@angular/core";
import { Component } from "@angular/core";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { register } from "swiper/element/bundle";
import * as AOS from "aos";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { catchError, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { JssContextService } from "../../jss-context.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() rendering: ComponentRendering;

  // Language and localization variables
  reversedLanguage: string = "";
  currentLanguage: string = "";
  currentPath: string = "";

  // Date and time
  currentDate: string = "";
  currentTime: string = "";

  // Weather
  temperature: string = "";
  weatherDescription: string = "";

  // UI state
  isSearchOpen = false;
  isMobile: boolean = false;

  //Current Location
  currentLocation: string = "Riyadh";

  searchKeyword: string = "";


  constructor(
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    private jssService: JssContextService
  ) {
    this.activatedRoute.url.subscribe((url) => {
      // // this.currentPath = url[0].path;

      this.currentLanguage = url[0]?.path?.toLowerCase() == "ar-sa" ? "ar-sa" : "en";
      this.reversedLanguage = this.currentLanguage === "ar-sa" ? "en" : "ar-sa";
      console.log('this.currentPath', url);
      console.log('this.currentLanguage', this.currentLanguage);
     
    });

    console.log('con');

  }

  ngOnInit(): void {
    console.log('ngOnInit');


    this.updateDocumentAttributes();

    // this.detectLang();
    // this.router.parseUrl(this.router.url);
    // console.log('this.router.url');
    // console.log(this.router.url);
    // console.log(this.router.parseUrl(this.router.url));
    // Initialize features
    // this.detectCurrentLanguage();
    this.initializeDateTimeAndWeather();

    // Initialize animations
    register();
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });

    // Detect device type
    this.checkDeviceType();
    this.renderer.listen("window", "resize", () => this.checkDeviceType());
  }

  ngAfterViewInit(): void {
    this.styleSwiperComponents();

    // this.jssService.state.subscribe((r) => {
    //   this.currentLanguage = r.language.toLowerCase();
    //   this.reversedLanguage = this.currentLanguage === "ar-sa" ? "en" : "ar-sa";
    //   this.updateDocumentAttributes();
    // });

  }

  /** Check and update device type */
  private checkDeviceType(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  /** Initialize and update date/time in real-time */
  private initializeDateTimeAndWeather(): void {
    this.updateDateTime();
    this.getWeather();

    // Update the date and time every second
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  /** Update date and time with localization */
  private updateDateTime(): void {
    const now = new Date();
    const locale = this.currentLanguage === "ar-sa" ? "ar" : "en";

    // Format the date and time
    const formattedDate =
      this.datePipe.transform(now, "dd MMMM yyyy", undefined, locale) || "";
    const formattedTime =
      this.datePipe.transform(now, "HH:mm", undefined, locale) || ""; // Include seconds

    // Convert to Arabic numerals if needed
    this.currentDate =
      this.currentLanguage === "ar-sa"
        ? this.convertToArabicNumbers(formattedDate)
        : formattedDate;
    this.currentTime =
      this.currentLanguage === "ar-sa"
        ? this.convertToArabicNumbers(formattedTime)
        : formattedTime;
  }

  private convertToArabicNumbers(input: string): string {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return input.replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
  }

  /** Fetch weather data */
  private getWeather(): void {
    const apiKey = "49b86bfe12489a646e8b11e73259e211";
    const lat = 24.7136; // Riyadh latitude
    const lon = 46.6753; // Riyadh longitude
    const units = "metric";
    const lang = this.currentLanguage === "ar-sa" ? "ar" : "en";

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${apiKey}`;

    this.http
      .get(apiUrl)
      .pipe(
        catchError((err) => {
          console.error("Error fetching weather data:", err);
          this.weatherDescription =
            this.currentLanguage === "ar-sa"
              ? "غير قادر على جلب بيانات الطقس"
              : "Unable to fetch weather data";
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response) {
          this.weatherDescription =
            response.weather?.[0]?.description ||
            (this.currentLanguage === "ar-sa"
              ? "لا يوجد وصف"
              : "No description available");
          this.temperature =
            this.currentLanguage === "ar-sa"
              ? this.convertToArabicNumbers(`${response.main?.temp || "N/A"}°C`)
              : `${response.main?.temp || "N/A"}°C`;
        }
      });
  }

  // private detectLang() {
  //   // Normalize language to lowercase and handle both "ar-sa" and "ar-SA"
  //   // const detectedLanguage = this.jssService.stateValue.language

  //   // // Ensure consistency in comparison
  //   // this.currentLanguage = detectedLanguage === "ar-sa" || detectedLanguage === "ar-SA".toLowerCase() ? "ar-sa" : "en";

  //   // // Set the reversed language accordingly
  //   // this.reversedLanguage = this.currentLanguage === "ar-sa" ? "en" : "ar-sa";

  //   // Update document attributes immediately
  //   this.updateDocumentAttributes();
  // }

  private updateDocumentAttributes(): void {
    const direction = this.currentLanguage === "ar-sa" ? "rtl" : "ltr";
    const lang = this.currentLanguage === "ar-sa" ? "ar" : "en";
    const currentLocation = this.currentLanguage === "ar-sa" ? "الرياض" : "Riyadh";

    console.log('direction', direction);
    console.log('lang', lang);
    setTimeout(() => {
      document.documentElement.setAttribute("dir", direction);
      document.documentElement.setAttribute("lang", lang);
    }, 10);

    this.currentLocation = currentLocation;
  }

  /** Style swiper components dynamically */
  private styleSwiperComponents(): void {
    const swiperContainers = document.querySelectorAll("swiper-container");
    swiperContainers.forEach((swiperContainer) => {
      const style = document.createElement("style");
      style.textContent = `
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background-color: #1B8354;
          border-radius: 4px;
          width: 32px !important;
          height: 32px !important;
          padding: 8px;
        }
        .swiper {
          padding: 0px 0 65px 0 !important;
        }
        .swiper-pagination-bullet-active {
          transform: scale(1.5);
        }
      `;
      swiperContainer.shadowRoot?.appendChild(style);
    });
  }

  /** Toggle search bar visibility */
  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  // generateDynamicHref(baseHref: string | undefined): string {
  //   if (!baseHref) return "#";
  //   return `/${this.currentLanguage}${baseHref}`;
  // }

  // changeLanguage(): void {
  //   let queryParams: any = {};
  //   this.activatedRoute.queryParams.subscribe((params) => {
  //     queryParams = params;
  //   });

  //   const currentUrlTree = this.router.parseUrl(this.router.url);
  //   const primarySegments = currentUrlTree.root.children["primary"].segments;
  //   const currentPathSegments = primarySegments.map((segment) =>
  //     segment.path.toLowerCase() // Normalize casing
  //   );

  //   if (this.isLanguageSegment(currentPathSegments[0])) {
  //     currentPathSegments[0] = this.reversedLanguage;
  //   } else {
  //     currentPathSegments.unshift(this.reversedLanguage);
  //   }

  //   const targetPath = `/${currentPathSegments.join("/")}`;
  //   this.jssService.changeLanguage(this.reversedLanguage);

  //   // Ensure attributes update before navigation
  //   this.updateDocumentAttributes();

  //   // Delay navigation slightly
  //   setTimeout(() => {
  //     this.router.navigate([targetPath], { queryParams });
  //   }, 1);
  // }

  // isLanguageSegment(segment: string): boolean {
  //   const supportedLanguages = ["ar-sa", "en", "fr", "es"]; 
  //   return supportedLanguages.includes(segment.toLowerCase()); // Normalize to lowercase
  // }

  changeLanguage(): void {
    this.currentLanguage = this.jssService.stateValue.language.toLowerCase() === "ar-sa" ? "ar-sa" : "en";
    this.reversedLanguage = this.currentLanguage === "ar-sa" ? "en" : "ar-sa";

    this.jssService.changeLanguage(this.reversedLanguage);

    // this.updateDocumentAttributes();
    this.navigateToLanguage();

  }

  navigateToLanguage(): void {
    const currentUrlTree = this.router.parseUrl(this.router.url);
    const currentItemPath = this.jssService.stateValue.sitecore.context.itemPath
    const targetPath = `/${this.reversedLanguage}${currentItemPath}`;

    this.router.navigate([targetPath], { queryParams: currentUrlTree.queryParams });
  }

  // isLanguageSegment(segment: string): boolean {
  //   const supportedLanguages = ["ar-sa", "en", "fr", "es"];
  //   return supportedLanguages.includes(segment.toLowerCase());
  // }


  Search(): void {
    if (this.searchKeyword) {
      this.router.navigate([`/${this.currentLanguage}/search`], {
        queryParams: { q: this.searchKeyword },
      });
    } else {
      console.warn("Search keyword is empty!");
    }
  }
}
