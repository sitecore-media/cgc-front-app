import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.css']
})
export class ContactInformationComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }
  copied = false;

  copySpanText(spanElement: HTMLElement): void {
    const text = spanElement.innerText;
    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000); // تخفي الرسالة بعد ثانيتين
    }).catch(err => {
      console.error('فشل النسخ:', err);
    });
  }
  ngOnInit() {
    // remove this after implementation is done
    console.log('ContactInformation component initialized with component data', this.rendering);
  }
}
