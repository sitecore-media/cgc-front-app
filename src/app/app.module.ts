import { APP_ID, NgModule, TransferState } from '@angular/core';
import { APP_BASE_HREF, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './routing/routing.module';
import { JssLayoutService } from './layout/jss-layout.service';
import { AppComponentsModule } from './components/app-components.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { JssTranslationClientLoaderService } from './i18n/jss-translation-client-loader.service';
import { JssTranslationLoaderService } from './i18n/jss-translation-loader.service';
import { GraphQLModule } from './jss-graphql.module';
import { JssMetaService } from './jss-meta.service';
import { JssContextService } from './jss-context.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import localeAr from '@angular/common/locales/ar'; // Arabic locale data
import localeEn from '@angular/common/locales/en'; // English locale data
import { GlobalService } from './services/global.service';
registerLocaleData(localeAr, 'ar'); // Register Arabic locale
registerLocaleData(localeEn, 'en'); // Register English locale

@NgModule({
  imports: [
    HttpClientModule,
    GraphQLModule,
    RoutingModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (transferState: TransferState) =>
          new JssTranslationClientLoaderService(new JssTranslationLoaderService(), transferState),
        deps: [TransferState],
      },
    }),
    AppComponentsModule,
    NgbModule,
  ],
  providers: [
    DatePipe,
    GlobalService,
    // The token is needed in cases when multiple applications are bootstrapped on a page
    { provide: APP_ID, useValue: 'my-app' },
    JssContextService,
    JssLayoutService,
    JssMetaService,
    // IMPORTANT: you must set the base href with this token, not a <base> tag in the HTML.
    // the Sitecore Experience Editor will not work correctly when a base tag is used.
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Add this line
})
export class AppModule { }
