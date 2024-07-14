import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransitionLineComponent } from '../components/v1/transition-line/transition-line.component';
import { LineComponent } from '../components/v1/line/line.component';
import { PlotAreaComponent } from '../components/v1/plot-area/plot-area.component';
import { Demo1PlotComponent } from '../components/v2/demo-1/demo-1.component';
import { DemoShapePlotComponent } from '../components/v2/demo-shape/demo-shape.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TransitionLineComponent,
    LineComponent,
    PlotAreaComponent,
    Demo1PlotComponent,
    DemoShapePlotComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
