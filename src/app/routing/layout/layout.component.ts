/* eslint-disable no-shadow, no-console */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteData, Field, LayoutServiceContextData } from '@sitecore-jss/sitecore-jss-angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JssState } from '../../JssState';
import { JssMetaService } from '../../jss-meta.service';

enum LayoutState {
  Layout,
  NotFound,
  Error,
}

interface RouteFields {
  [name: string]: unknown;
  pageTitle?: Field<string>;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit, OnDestroy {
  route: RouteData<RouteFields>;
  state: LayoutState;
  LayoutState = LayoutState;
  subscription: Subscription;
  errorContextData: LayoutServiceContextData;
  portalRootName: string = 'وزارة الاعلام';
  isWrapped: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private readonly meta: JssMetaService) {

  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(r => {
      this.isWrapped = r.filter(r => r.path === 'contact-us')[0]?.path === 'contact-us';
    });

    // route data is populated by the JssRouteResolver
    this.subscription = this.activatedRoute.data.subscribe((data: { jssState: JssState }) => {
      if (!data.jssState) {
        this.state = LayoutState.NotFound;
        return;
      }

      if (data.jssState.sitecore && data.jssState.sitecore.route) {
        this.route = data.jssState.sitecore.route;
        this.route.itemLanguage
        if (this.route.itemLanguage === 'ar') {
          this.portalRootName = 'وزارة الاعلام';
        } else if (this.route.itemLanguage === 'en') {
          this.portalRootName = 'Ministry of Media';
        }
        this.setMetadata(this.route.fields);
        this.state = LayoutState.Layout;
      }

      if (data.jssState.routeFetchError) {
        if (
          data.jssState.routeFetchError.status >= 400 &&
          data.jssState.routeFetchError.status < 500
        ) {
          this.state = LayoutState.NotFound;
        } else {
          this.state = LayoutState.Error;
        }

        this.errorContextData =
          data.jssState.routeFetchError.data && data.jssState.routeFetchError.data.sitecore;
      }
    });
  }

  ngOnDestroy() {
    // important to unsubscribe when the component is destroyed
    this.subscription.unsubscribe();
  }

  setMetadata(routeFields: RouteFields) {
    // set page title, if it exists
    if (routeFields && routeFields.title) {
      this.meta.setTitle((routeFields?.title as Field<string>)?.value + ' | ' + this.portalRootName || 'Page');
      this.meta.setTag('keywords', (routeFields?.MetaKeywords as Field<string>)?.value || '');
      this.meta.setTag('description', (routeFields?.MetaDescription as Field<string>)?.value || '');
    }
    // if (routeFields && routeFields.breadcrumbTitle) {
    //   this.meta.setTitle((routeFields?.breadcrumbTitle as Field<string>)?.value + ' | ' + this.portalRootName || 'Page');
    //   this.meta.setTag('keywords', (routeFields?.MetaKeywords as Field<string>)?.value || '');
    //   this.meta.setTag('description', (routeFields?.MetaDescription as Field<string>)?.value || '');
    // }
  }

  onPlaceholderLoaded(_placeholderName: string) {
    window.scrollTo(0, 0);

    // you may optionally hook to the loaded event for a placeholder,
    // which can be useful for analytics and other DOM-based things that need to know when a placeholder's content is available.
  }



}
