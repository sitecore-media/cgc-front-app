import { Component, OnInit, Input } from "@angular/core";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RulesViewComponent } from "../rules-view/rules-view.component";
import { JssContextService } from "../../jss-context.service";

@Component({
  selector: "app-regulations-system",
  templateUrl: "./regulations-system.component.html",
  styleUrls: ["./regulations-system.component.scss"],
})
export class RegulationsSystemComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  isPdfOpen = false;
  selectedPdf: SafeResourceUrl | null = null;
  pdfUrl: string | null = null;
  //name = "Angular " + VERSION.major;
  //urlPdf: string ="https://docs.google.com/gview?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true";
    //urlSafe: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer,
    private jssService: JssContextService,
    private modalService: NgbModal 
  ) {}
  open_pdf(filePath:string) {
    this.modalService.open(RulesViewComponent, { centered: true, size: 'xl', backdrop: 'static' });
    this.sendPath(filePath);
  }
  sendPath(filePath:string) {
    this.jssService.sendPathFile(filePath);
  }

  ngOnInit() {
    //this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlPdf);
    console.log("RegulationsSystem component initialized with component data", this.rendering);
  }

  openPdfPopup(pdfUrl: string | null) {
    if (pdfUrl) {
      console.log("Opening PDF:", pdfUrl);
      this.pdfUrl = pdfUrl; // Save the original URL for debugging
      this.selectedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.isPdfOpen = true;
    }
  }

  closePdfPopup(event: Event) {
    if ((event.target as HTMLElement).classList.contains("overlay-contact")) {
      this.isPdfOpen = false;
      this.selectedPdf = null;
      this.pdfUrl = null;
    }
  }
}
