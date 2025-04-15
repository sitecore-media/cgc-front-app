import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-consortium',
  templateUrl: './consortium.component.html',
  styleUrls: ['./consortium.component.scss']
})
export class ConsortiumComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('Consortium component initialized with component data', this.rendering);
  }

  isvidOpen = false;

  toggleVid() {
    this.isvidOpen = !this.isvidOpen;
      const lightBoxVideo = document.getElementById("VisaChipCardVideo") as HTMLVideoElement | null;
      if (lightBoxVideo) {
        lightBoxVideo.play();
      } 
  }

   lightboxClose(): void {
    this.isvidOpen = !this.isvidOpen;
    const lightBoxVideo = document.getElementById("VisaChipCardVideo") as HTMLVideoElement | null;
    if (lightBoxVideo) {
      lightBoxVideo.pause();
    }
  }
}
