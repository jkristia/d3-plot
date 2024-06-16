import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransitionLineComponent } from '../components/transition-line/transition-line.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TransitionLineComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
