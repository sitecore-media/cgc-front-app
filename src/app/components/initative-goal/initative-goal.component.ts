import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-initative-goal',
  templateUrl: './initative-goal.component.html',
  styleUrls: ['./initative-goal.component.scss']
})
export class InitativeGoalComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('InitativeGoal component initialized with component data', this.rendering);
  }
}
