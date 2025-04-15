import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { register } from 'swiper/element/bundle';
import * as AOS from 'aos';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-initiatives',
  templateUrl: './initiatives.component.html',
  styleUrls: ['./initiatives.component.scss']
})
export class InitiativesComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  scrollDown:string="التمرير لأسفل";

  PageIndex: number = 1;
  PageSize: number = 10;
  dataLength: number;
  keyWord: any;
  page: any;
  limit = 10;
  List: any[] = [];
  data: any;

  constructor() { }
 
  
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


  ngOnInit() {
       register();
        AOS.init({
          duration: 1000, // Animation duration in milliseconds
          once: true, // Whether animation should happen only once
          easing: 'ease-in-out', // Easing function
        });
    
    // remove this after implementation is done
    console.log('Initiatives component initialized with component data', this.rendering);
  }
}
