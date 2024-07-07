import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransitionLineComponent } from '../components/v1/transition-line/transition-line.component';
import { LineComponent } from '../components/v1/line/line.component';
import { PlotAreaComponent } from '../components/v1/plot-area/plot-area.component';
import { PlotAreaV2Component } from '../components/v2/plot-area/plot-area.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TransitionLineComponent,
    LineComponent,
    PlotAreaComponent,
    PlotAreaV2Component,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
