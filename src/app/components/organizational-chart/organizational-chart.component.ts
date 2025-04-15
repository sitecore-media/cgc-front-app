import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { TreeNode } from 'primeng/api';
import { JssContextService } from "../../jss-context.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
@Component({
  selector: 'app-organizational-chart',
  templateUrl: './organizational-chart.component.html',
  styleUrls: ['./organizational-chart.component.scss']
})
export class OrganizationalChartComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  data: TreeNode[] = [];
  sectionTitle: any;

  constructor(
    private jssService: JssContextService,
    private http: HttpClient
  ) { }
  selectedDepartment: any = null;


  isContactOpen = false;
  isContactOpenToMinster = false;

  toggleContact(department?: any) {
    console.log('department')
    console.log(department)
    this.isContactOpen = !this.isContactOpen;
    this.selectedDepartment = department;
  }

  toggleContactToMinister() {
    this.isContactOpenToMinster = !this.isContactOpenToMinster;
  }



  ngOnInit() {

    // remove this after implementation is done
    console.clear();
    console.log('OrganizationalChart component initialized with component data', this.rendering);
    // this.data = [
    //   {
    //     label: 'الوزير',
    //     expanded: true,
    //     styleClass: 'level-1',
    //     children: [
    //       {
    //         label: 'نائب الوزير ',
    //         expanded: true,
    //         styleClass: 'level-2',
    //         children: [
    //           {
    //             label: 'التحول الرقمي وتقنية المعلومات',
    //             styleClass: 'level-3',
    //           },
    //           {
    //             label: 'مركز الوثائق والمحفوظات',
    //             styleClass: 'level-3',
    //           },
    //           {
    //             label: 'الإدارة العامة للموارد البشرية',
    //             styleClass: 'level-3',
    //             expanded: true,

    //             children: [
    //               {
    //                 label: 'التحول الرقمي  ',
    //                 styleClass: 'level-4',
    //               },
    //               {
    //                 label: 'مركز الوثائق ',
    //                 styleClass: 'level-4',
    //               },


    //             ]
    //           },
    //           {
    //             label: 'وكالة الخدمات المشتركة',
    //             styleClass: 'level-3',
    //           },
    //           {
    //             label: 'وكالة التخطيط ',
    //             styleClass: 'level-3',
    //           }
    //         ]
    //       },
    //       {
    //         label: 'مكتب الوزير',
    //         expanded: true,
    //         styleClass: 'level-2',

    //       },
    //       {
    //         label: 'دارة أمن المعلومات',
    //         expanded: true,
    //         styleClass: 'level-2'

    //       },
    //       {
    //         label: 'المكتب التنفيذي',
    //         expanded: true,
    //         styleClass: 'level-2'
    //       },

    //       {
    //         label: 'مكتب تحقيق الرؤية',
    //         expanded: true,
    //         styleClass: 'level-2',
    //         children: [
    //           {
    //             label: 'الإدارة العامة للشؤون القانونية',
    //             styleClass: 'level-3',
    //           },
    //           {
    //             label: 'الإدارة العامة للمراجعة الداخلية',
    //             styleClass: 'level-3',
    //           },
    //           {
    //             label: 'وكالة العلاقات الإعالمية الدولية',
    //             styleClass: 'level-3',
    //           }
    //         ]
    //       }


    //     ]
    //   }
    // ];

    this.data = this.transformOrgChart(this.rendering.fields);
    this.getSearchResults();
  }

  transformOrgChart(json: any) {
    console.log('Transforming organizational chart data', json);
    const rootNode = json;
    if (!rootNode) return [];
    console.clear();

    // Process root node (level-1)
    return [{
      label: rootNode.fields?.title?.value || 'الوزير',
      expanded: true,
      styleClass: 'level-1',
      children: this.processSections(rootNode.organizationalSection || [], 2),
      item: rootNode
    }];
  }

  private processSections(sections: any[], depth: number): TreeNode[] {
    return sections.map(section => {
      const label = section.fields?.title?.value || '';
      const children = section.fields.organizationalSection || [];
      const hasChildren = children.length > 0;

      // Special case handling for specific labels if needed
      // const formattedLabel = label.replace('والتنمية', '').trim();

      return {
        label: label,
        // expanded: hasChildren || depth === 2, // Level-2 nodes are always expanded
        expanded: true,
        styleClass: `level-${depth}`,
        children: hasChildren ? this.processSections(children, depth + 1) : [],
        item: section

      };
    });
  }

  test(node: any) {

    this.toggleContact(node.item);
  }
    getSearchResults(): void {
    const apiUrl =
      `${environment.sitecoreApiHost}/sitecore/api/layout/render/default`;

    const params = new HttpParams()
      .set("item", "/the-ministry/organizationl-chart")
      // .set("take", this.pageSize.toString())
      .set("sc_apikey", environment.sitecoreApiKey)
      .set("sc_site", environment.sitecoreSiteName)
      .set("sc_lang", this.jssService.stateValue.language)
      .set("tracking", "Information");

    this.http.get(apiUrl, { params }).subscribe({
      next: (response: any) => this.handleTitleResults(response),
      error: (error) => this.handleError(error),
    });
    }
    private handleTitleResults(response: any): void {

      const searchMore = response?.sitecore?.route?.fields?.title?.value;
  
      this.sectionTitle = searchMore;
    }
  
    private handleError(error: any): void {
      console.error("Error fetching search results:", error);
    }
}
