import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-about-ministry',
  templateUrl: './about-ministry.component.html',
  styleUrls: ['./about-ministry.component.scss']
})
export class AboutMinistryComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  reversedLanguage: string = 'ar-SA'; // Reversed language
  currentLanguage: string = 'en';

    constructor(private router: Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getCurrentLang(); 
    // remove this after implementation is done
    console.log('AboutMinistry component initialized with component data', this.rendering);
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
}
