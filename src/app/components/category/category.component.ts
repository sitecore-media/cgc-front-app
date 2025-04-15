import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor(private lightbox: Lightbox) { }
  selectedValue: string = '';
  page = 1;
  switchTypes: string[] = ['border-all', 'list']; // Array to hold switch types
  activeSwitchType: string = this.switchTypes[0]; // Default active switch type
  setActiveSwitchType(type: string): void {
    this.activeSwitchType = type;
  }
  ngOnInit() {
    // remove this after implementation is done
    console.log('Category component initialized with component data', this.rendering);
  }

  album = [
    { src: 'assets/img/media/image-gallery1.png', title: 'وزير الإعلام خلال زيارته لمملكة البحرين', caption: 'جلالة ملك البحرين يستقبل معالي وزير الإعلام خلال زيارته لمملكة #البحرين ليترأس وفد المملكة في أعمال الاجتماع الرابع للجنة التنسيق في مجالات الثقافة والإعلام والسياحة والتنمية الاجتماعية المنبثقة عن مجلس التنسيق السعودي البحريني الذي تستضيفه البحرين.', thumb: 'assets/img/media/image-gallery1.png' },
    { src: 'assets/img/media/image-gallery3.png', title: 'حفل جوائز جوي أوورد ', caption: 'Image 2', thumb: 'assets/img/media/image-gallery3.png' },
    { src: 'assets/img/media/image-gallery2.png', title: 'زيارة معالي وزير الإعلام محافظ الأحساء  ', caption: 'Image 3', thumb: 'assets/img/media/image-gallery2.png' }
  ];
  open(index: number): void {
    const lightboxAlbum = this.album.map(img => ({
      src: img.src,
      caption: `<div class='lightbox-header'>
                  <h3>${img.title}</h3>
                  <p>${img.caption}</p>
                </div>`,
      thumb: img.thumb
    }));

    this.lightbox.open(lightboxAlbum, index, { centerVertically: false, disableScrolling: true });
  }



  close(): void {
    this.lightbox.close();
  }

}
