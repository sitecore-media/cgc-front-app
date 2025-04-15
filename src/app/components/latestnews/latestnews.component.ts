// import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
//import { Router } from '@angular/router';
//import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { register } from 'swiper/element/bundle';
import * as AOS from 'aos';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-latestnews',
  templateUrl: './latestnews.component.html',
  styleUrls: ['./latestnews.component.scss']
})
export class LatestnewsComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  isMobile: boolean = false;
  // Date and time
  currentDate: string = '';
  currentTime: string = '';


  PageIndex: number = 1;
  PageSize: number = 10;
  dataLength: number;
  keyWord: any;
  page: any;
  limit = 10;
  List: any[] = [];
  data: any;
  constructor(
   // private router: Router,
   // private modalService: NgbModal,
    ) {


  }

  customOptions: OwlOptions = {
    loop: true,
    items:2,
    rtl: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay:true,
    navSpeed: 700,
    margin:20,
    center:true,
    //stagePadding:40,
    dotsEach:true,
   
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3.6
      }
    },
    nav: true,
    navText: [
      '<i class="fi fi-rr-angle-small-left"></i>' ,// السهم الأيمن
      '<i class="fi fi-rr-angle-small-right"></i>' // السهم الأيسر

    ],
  }

  customOptionsnews: OwlOptions = {
    loop: true,
    items:1,
    rtl: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay:true,
    navSpeed: 700,
    margin:20,
    center:true,
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
        items: 3
      },
      
    },
    nav: true,
    navText: [
      '<i class="fi fi-rr-angle-small-left"></i>', // السهم الأيسر
      '<i class="fi fi-rr-angle-small-right"></i>' // السهم الأيمن
    ],
  }

 
  
  
  
  scrollToDiv() {
    const targetPosition = 400; // Replace with your desired position
    const startPosition = window.scrollY || window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // Animation duration in ms
    let startTime: number | null = null;
  
    const easeInOutQuad = (time: number, start: number, change: number, duration: number) => {
      time /= duration / 2;
      if (time < 1) return (change / 2) * time * time + start;
      time--;
      return (-change / 2) * (time * (time - 2) - 1) + start;
    };
  
    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const nextScrollPosition = easeInOutQuad(elapsedTime, startPosition, distance, duration);
  
      window.scrollTo(0, nextScrollPosition);
  
      if (elapsedTime < duration) {
        requestAnimationFrame(animation);
      }
    };
  
    requestAnimationFrame(animation);
  }

  
  ngOnInit(): void {
    register();
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
      easing: 'ease-in-out', // Easing function
    });

  }

  ngAfterViewInit(): void {
    const swiperContainers = document.querySelectorAll('swiper-container'); // Corrected to querySelectorAll
    swiperContainers.forEach((swiperContainer) => {
      const style = document.createElement('style');
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
        .swiper-button-prev svg,
        .swiper-button-next svg {
          width: 32% !important;
        }
        .swiper {
          padding: 0px 0 65px 0 !important;
        }
        .swiper-pagination {
          z-index: 5 !important;
        }
           .custum.swiper-pagination {
           bottom: 60px!important;
        }
          
        .swiper-pagination-bullet-active {
          transform: scale(1.5);
        }
          
      `;
      swiperContainer.shadowRoot?.appendChild(style);
    });


  }

  
  //constructor() {
  //}
  // ,private datePipe: DatePipe
  /**scrollToDiv() {
    const targetPosition = 400; // Replace with your desired position
    const startPosition = window.scrollY || window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // Animation duration in ms
    let startTime: number | null = null;

    const easeInOutQuad = (time: number, start: number, change: number, duration: number) => {
      time /= duration / 2;
      if (time < 1) return (change / 2) * time * time + start;
      time--;
      return (-change / 2) * (time * (time - 2) - 1) + start;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const nextScrollPosition = easeInOutQuad(elapsedTime, startPosition, distance, duration);

      window.scrollTo(0, nextScrollPosition);

      if (elapsedTime < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }*/
  //ngOnInit() {
    //this.checkDeviceType();
    // this.updateDateTime();
   // Get the current language on initialization
    // remove this after implementation is done
    //console.log('Latestnews component initialized with component data', this.rendering);
  //}
  /**private checkDeviceType(): void {
    this.isMobile = window.innerWidth <= 768; // Mobile if width <= 768px

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }*/

  /** Update date and time with localization */
  // private updateDateTime(): void {
  //   const now = new Date();
  //   const locale = this.currentLanguage === 'ar-SA' ? 'ar' : 'en';

  //   // Format the date and time
  //   const formattedDate = this.datePipe.transform(now, 'dd-MMMM-yyyy', undefined, locale) || '';
  //   const formattedTime = this.datePipe.transform(now, 'HH:mm:ss', undefined, locale) || ''; // Include seconds

  //   // Convert to Arabic numerals if needed
  //   this.currentDate = this.currentLanguage === 'ar-SA' ? this.convertToArabicNumbers(formattedDate) : formattedDate;
  //   this.currentTime = this.currentLanguage === 'ar-SA' ? this.convertToArabicNumbers(formattedTime) : formattedTime;
  // }

  // private convertToArabicNumbers(input: string): string {
  //   const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  //   return input.replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
  // }
}
