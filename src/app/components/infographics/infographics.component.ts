import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { register } from 'swiper/element/bundle';
import * as AOS from 'aos';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-infographics',
  templateUrl: './infographics.component.html',
  styleUrls: ['./infographics.component.scss']
})
export class InfographicsComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  isMobile: boolean = false;

  PageIndex: number = 1;
  PageSize: number = 10;
  dataLength: number;
  keyWord: any;
  page: any;
  limit = 10;
  List: any[] = [];
  data: any;
  album: any[] = [];
  mainPageMediaShown: any[]=[];
  constructor(private lightbox: Lightbox) { }

  
  //album = [
    //{ src: 'assets/img/media/info1.png', title: 'وزير الإعلام خلال زيارته لمملكة البحرين',  thumb: 'assets/img/media/info1.png' },
   // { src: 'assets/img/media/info2.png', title: '   حوارية وثقــــــافية واجتمـــــاعية كوكبة من البرامج على شاشات قنوات هيئة الإذاعة والتلفزيون ', thumb: 'assets/img/media/info2.png' },
    //{ src: 'assets/img/media/info3.png', title: 'زيارة معالي وزير الإعلام محافظ الأحساء  ',  thumb: 'assets/img/media/info3.png' },

  //];
 
  open(index: number): void {
    const lightboxAlbum = this.album.map(img => ({
      src: img.src,
      caption: `<div class='lightbox-header'>
                  <h3>${img.title}</h3>
                </div>`,
      thumb: img.thumb
    }));

    this.lightbox.open(lightboxAlbum, index , {  centerVertically:false ,  disableScrolling:true });
  }


  private checkDeviceType(): void {
    this.isMobile = window.innerWidth <= 768; // Mobile if width <= 768px
  }
  slides = [
    { id: 1, title: 'Slide 1', image: 'assets/img/media/ingogr1.svg' },
    { id: 2, title: 'Slide 2', image: 'assets/img/media/Infogr2.svg' },
    { id: 3, title: 'Slide 3', image: 'assets/img/media/infogr3.jpeg' },
    { id: 4, title: 'Slide 4', image: 'assets/img/media/Infogr2.svg' }
  ];
  //slides: any[] = [];

  activeSlideIndex: number = 0; // تخزين مؤشر الشريحة النشطة
customOptionsinfogr: OwlOptions = {

    loop: true,
    startPosition:0,
    items:1,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay:true,
    navSpeed: 700,
    margin:20,
    rtl: true,

    //center:true,
    //stagePadding:40,
    dotsEach:true,
   
    responsive: {
      640: {
        items: 1.5
      },
      768: {
        items: 2
      },
      1024: {
        items: 3.1
      },
      
    },
    nav: true,
    navText: [
      '<i class="fi fi-rr-angle-small-left"></i>', // السهم الأيسر
      '<i class="fi fi-rr-angle-small-right"></i>' // السهم الأيمن
    ],
  }
  onTranslated(event: any): void {
    const currentIndex = event.startPosition || event.item?.index || 0; // البحث عن أول خاصية متاحة
    this.activeSlideIndex = currentIndex;
    console.log('Active slide index:', this.activeSlideIndex);
  }
  ngOnInit() {
    register();
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
      easing: 'ease-in-out', // Easing function
    });
    this.checkDeviceType();
    const mediaList = (this.rendering?.fields as any)?.mediaData?.MediaResultModels || [];
    //const mainPageMedia = mediaList?.filter((item: any) => item.IsMainPage === "1") || [];
     
     if (mediaList.length > 3) {
      this.mainPageMediaShown = mediaList.slice(0, 3);
    } else if (mediaList.length < 3 && mediaList.length > 1) {
      this.mainPageMediaShown = mediaList.slice(0, mediaList.length);
    }
      
    console.log("mediaList=",mediaList.length);
    console.log("mainPageMedia=",this.mainPageMediaShown.length);
    console.log("mediaListAll=",mediaList);

    if (mediaList?.length) {
      this.album = this.mainPageMediaShown.map((item: any) => ({
        src: item.Image,
        title: item.Title || '',
        thumb: item.ThumbnailUrl
      }));
    }
    console.log('Infographics component initialized with component data', this.rendering);
  }


}
