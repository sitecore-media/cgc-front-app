import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JssContextService } from "../../jss-context.service";

@Component({
  selector: 'app-rules-view',
  templateUrl: './rules-view.component.html',
  styleUrls: ['./rules-view.component.css']
})
export class RulesViewComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor( public activeModal: NgbActiveModal,
    private jssService: JssContextService,
  ) {}
  //pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  pdfSrc!:string;
  ngOnInit() {
    this.jssService.currentPath.subscribe(pathFile => this.pdfSrc = pathFile);
    // remove this after implementation is done
    console.log('RulesView component initialized with component data', this.rendering);
  }
}
