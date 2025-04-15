import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {

  constructor() {}

  transform(value: Date | string | null): string {
    if (!value) return ''; // Handle null or undefined values

    // Get the language from the URL
    const currentUrl = window.location.pathname;  // Get the current URL path
    const langMatch = currentUrl.match(/^\/(ar-sa|en)(?:\/|$)/); // Match either /ar-SA or /en
    const locale = langMatch ? langMatch[1] : 'en'; // Default to 'en' if no match found

    // Format the date using the appropriate locale
    const date = typeof value === 'string' ? new Date(value) : value;
    const datePipe = new DatePipe(locale);  // Use the locale to format the date
    const formattedDate = datePipe.transform(date, 'd MMMM y') || '';

    // Convert to Arabic numerals if the language is Arabic
    return locale === 'ar-sa' ? this.convertToArabicNumbers(formattedDate) : formattedDate;
  }

  private convertToArabicNumbers(input: string): string {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return input.replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
  }
}
