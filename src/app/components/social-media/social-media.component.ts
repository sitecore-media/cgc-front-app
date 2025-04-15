
import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

//declare var twttr: any;
declare global {
  interface Window {
    twttr: any;
  }
}


@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css']
})
export class SocialMediaComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  videos2: any[]=[];
  constructor( private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    this.renderer.appendChild(document.body, script);

    script.onload = () => {
      if (window['twttr']) {
        window['twttr'].widgets.load();
      }
    };
  }
  
  // getThumbnail(videoUrl: string): string {
  //   return `https://img.youtube.com/vi/${videoUrl.split('/embed/')[1]}/0.jpg`;
  // }
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

  ngOnInit() {
    const socialMediaList = (this.rendering?.fields as any)?.youTubeList || [];
    console.log("socialMediaList=",socialMediaList);
    console.log("socialMediaList=",socialMediaList.length);
    if (socialMediaList?.length) {
      this.videos2 = socialMediaList.map((item: any) => ({
        title: item?.displayName || 'SocialMedia',
        url: item?.fields?.link?.value?.href || 'socail'
      }));
    }
    console.log("videos2=",this.videos2);
    console.log("videos2=",this.videos2.length);
    // remove this after implementation is done
    console.log('socialMedia component initialized with component data', this.rendering);
  }
}
