import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-home',
  imports: [CardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly features = [
    { title: 'Theme ready', text: 'Light and dark palettes are powered by your custom earth-tone colors.' },
    { title: 'Reusable UI', text: 'Inputs, buttons, cards, header, and footer are ready for feature pages.' },
    { title: 'Role-based auth', text: 'Customer and admin sections are guarded for the correct logged-in role.' },
  ];
}
