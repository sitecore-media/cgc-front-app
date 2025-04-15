import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  reversedLanguage: string = 'ar-SA'; // Reversed language
  currentLanguage: string = 'en';
  currentYear: string = "";
  constructor(private datePipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getCurrentLang();
    const now = new Date();
    this.currentYear = this.datePipe.transform(now, 'yyyy');
    // remove this after implementation is done
    console.log('Footer component initialized with component data', this.rendering);
  }


  getCurrentLang(): void {
    // Get the current language from the URL
    this.activatedRoute.url.subscribe(() => {
      const urlSegment = this.router.url.split('/')[1];
      this.currentLanguage = urlSegment === 'ar-SA' ? 'ar-SA' : 'en'; // Default to 'en' if not 'ar-SA'
      this.reversedLanguage = urlSegment === 'ar-SA' ? 'en' : 'ar-SA'; // Default to 'en' if not 'ar-SA'

      this.updateDocumentAttributes();
    });
  }
  private updateDocumentAttributes(): void {
    const direction = this.currentLanguage === 'ar-SA' ? 'rtl' : 'ltr';
    const lang = this.currentLanguage === 'ar-SA' ? 'ar' : 'en';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', lang);
  }
  generateDynamicHref(baseHref: string | undefined): string {
    if (!baseHref) {
      return '#'; // Return '#' if the link is undefined
    }
    // Construct the dynamic URL with the current language
    const updatedHref = `/${this.currentLanguage}${baseHref}`;
    return updatedHref;
  }




  // media camera

  getVideoId(url: string): string {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    console.log("Extracted Video ID:", match ? match[1] : "Not Found");
    return match ? match[1] : '';
  }
  getThumbnail(videoUrl: string): string {
    const videoId = this.getVideoId(videoUrl);
    console.log("Thumbnail URL:", videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : "Default Image");
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'assets/default-thumbnail.jpg';
  }

  videos = [
    { title: ' من قلب المنتدى الاقتصادي العالمي، القناة الإخبارية في دافوس', url: 'https://www.youtube.com/embed/PoqYlYitjpo?si=E7oufDb7NKHUbtw2' },
    { title: 'وزير الاتصالات وتقنية المعلومات في المؤتمر الصحفي الحكومي', url: 'https://www.youtube.com/embed/3D0nYlNExmQ?si=gxSh2kL-DezaG-NF' },
    { title: '  إذاعة طامي تجربة إعلامية سبقت زمانها', url: 'https://www.youtube.com/embed/XoDG_G3Ixm8?si=644uykT_WkPCDcIy' },
    { title: ' نقطة البداية لبناء الجسر الإعلامي بين المملكة والصين', url: 'https://www.youtube.com/embed/gn_gcErqofI?si=rQV1QryuF8e0Pm4V' },
    { title: 'المذيع مزيد السبيعي والأخبار الوطنية', url: 'https://www.youtube.com/embed/U9AooDPSVoM?si=EyleUDFE70zKPqa2' },

  ];

  currentVideo = this.videos[0].url;

  changeVideo(videoUrl: string) {
    this.currentVideo = videoUrl;
  }
  isActive(videoUrl: string): boolean {
    return this.currentVideo === videoUrl;
  }
  slickConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    infinite: false,
    vertical: true,
    verticalSwiping: true
  };
  prevSlide(slick: any) {
    slick.slickPrev();
  }

  nextSlide(slick: any) {
    slick.slickNext();
  }


}
