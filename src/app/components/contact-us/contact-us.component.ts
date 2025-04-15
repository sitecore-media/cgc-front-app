import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  fileName: string | null = null;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('ContactUs component initialized with component data', this.rendering);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name; // Update the file name
    } else {
      this.fileName = null; // Reset if no file selected
    }
  }
}
