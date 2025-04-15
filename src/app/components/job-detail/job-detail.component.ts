
import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-angular';
import { JssContextService } from "../../jss-context.service";


@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  isContactOpen = false;
  readMore: { text: string; href: string }[] = [];
hrefJobForm: string ="" ;
  constructor(private jssService: JssContextService) { }

  // toggleContact() {
  //   this.isContactOpen = !this.isContactOpen;
  // }

  ngOnInit() {
    console.log('JobDetail component initialized with component data', this.rendering);

    const linkField = this.rendering.fields.link as Field<{
      text: string;
      href: string;
      querystring: string;
      id: string;
    }>;

    const linkValue = linkField.value;
    const text = linkValue.text;
    // const href = linkValue.href;
    const querystring = linkValue.querystring;
    const id = linkValue.id;

    const titleField = this.rendering.fields.title as Field<{ value: string }>;
    const title = titleField?.value || 'Untitled'; 
    const updatedQuerystring = querystring.replace('{itemId}', id);

 
    const fullHref = `${this.jssService?.stateValue?.language || "en"}/the-ministry/jobs/job-form/?Pageid=${id}`;
// test
    console.log("text", text);
    console.log("fullHref", fullHref);
    console.log("querystring", querystring);
    console.log("updatedQuerystring", updatedQuerystring);
    console.log("titleField", titleField);
    console.log("title", title);
    console.log("id", id);

    this.readMore = [{ text, href: fullHref }];
  }
}