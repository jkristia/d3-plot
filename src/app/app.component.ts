import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransitionLineComponent } from '../components/v1/transition-line/transition-line.component';
import { LineComponent } from '../components/v1/line/line.component';
import { PlotAreaComponent } from '../components/v1/plot-area/plot-area.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TransitionLineComponent,
    LineComponent,
    PlotAreaComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
