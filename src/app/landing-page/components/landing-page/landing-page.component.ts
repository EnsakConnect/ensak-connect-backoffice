import { Component } from '@angular/core';
import {AsyncPipe, NgOptimizedImage, NgSwitch, NgSwitchCase} from "@angular/common";
import {Observable} from "rxjs";
import {StepperOrientation} from "@angular/cdk/stepper";
import {BreakpointObserver} from "@angular/cdk/layout";
import {map} from "rxjs/operators";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatGridListModule,
    AsyncPipe,
    NgSwitch,
    MatCardModule,
    NgSwitchCase
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {


  stepperOrientation: Observable<StepperOrientation>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }




}
