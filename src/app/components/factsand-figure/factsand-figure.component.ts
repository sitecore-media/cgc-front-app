import { Component, OnInit, Input, Renderer2 } from "@angular/core";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";

@Component({
  selector: "app-factsand-figure",
  templateUrl: "./factsand-figure.component.html",
  styleUrls: ["./factsand-figure.component.scss"],
})
export class FactsandFigureComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  isMobile: boolean = false;

  constructor(private renderer: Renderer2) {}

  private checkDeviceType(): void {
    this.isMobile = window.innerWidth <= 768; // Mobile if width <= 768px
    // Optional: Add a listener for screen resize
    this.renderer.listen("window", "resize", () => {
      this.checkDeviceType();
    });
  }

  ngOnInit() {
    this.checkDeviceType();
    // remove this after implementation is done
    console.log(
      "FactsandFigure component initialized with component data",
      this.rendering
    );
  }


  
}
