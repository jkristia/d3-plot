import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CHART_TABS } from './chart-tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
	readonly tabs = CHART_TABS;
}
