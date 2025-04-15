import { Injectable } from '@angular/core';
import { dictionaryServiceFactory } from "../lib/dictionary-service-factory";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private dictionary = dictionaryServiceFactory.create();
  constructor() {


  }

  getDictionaryData(lang: string): Promise<any> {
    return this.dictionary
      .fetchDictionaryData(lang);

  }

}
